import { useState, useEffect } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useOutletContext
} from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import useInputChange from '../useInputChange';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaUnlink, FaLink } from 'react-icons/fa'

import Stack from 'react-bootstrap/Stack';
import Body from './navigation/Body';
import RankingsBadges from './RankingsBadges';
import RequestType from './RequestType';
import RequestAccount from './RequestAccount';
import Loader from './loaders/Loader';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import Popover from 'react-bootstrap/Popover';
import InputField from './form/InputField';
import Form from 'react-bootstrap/Form';

function LinkPopover({ request_url, setShowLinkOverlay, isParent, setObj, setLinks }) {
  const api = useApi();
  const [input, handleInputChange] = useInputChange();
  const handleSubmit = async (event) =>  {
    event.preventDefault();

  }
  const [formErrors, setFormErrors] = useState({});

  const handleLinkAsParent = async () => {
    const data = await api.post(`${request_url}/add_child`, '', {
      body: {
        submission_id: input.LinkID
      }
    })
    if (!data.ok) {
      console.log('Response not ok!!')
    }
    setShowLinkOverlay(false)
    setObj(data.body)
    setLinks(data.body._links)
  }
  const handleLinkAsChild = async () => {
    const data = await api.post(`${request_url}/set_parent`, '', {
      body: {
        'parent_id': input.LinkID
      }
    })
    if (!data.ok) {
      console.log('Response not ok!!')
    }
    setShowLinkOverlay(false)
    setObj(data.body)
    setLinks(data.body._links)
  }
  return (
    <Popover id='popover-basic' className='LinkPopover'>
      <Form onSubmit={handleSubmit}>
        <Popover.Header as='h5'>
          Link Request To:
        </Popover.Header>
        <Popover.Body>
          <Stack>
          <InputField 
            name='LinkID'
            defaultValue={''}
            changeHandler={handleInputChange}
            error={formErrors.LinkID}
            placeholder={'Request ID'}
            />
            <Button
              variant='primary'
              size='sm'
              type='buttom'
              onClick={handleLinkAsParent}>
              Link as Parent
            </Button>
            {!isParent &&
            <Button
              variant='secondary'
              size='sm'
              type='button'
              onClick={handleLinkAsChild}>
              Link as Child
            </Button>
            }
          </Stack>
        </Popover.Body>
      </Form>
    </Popover>
  );
}

function RequestModal({isDetail, setIsDetail}) {
  const { request_id } = useParams(':request_id');
  const request_url = `/requests/${request_id}`;
  const location = useLocation();
  const backgroundLocation = location.state.backgroundLocation;
  const navigate = useNavigate();

  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    navigate(backgroundLocation);
    setIsDetail(false);
  }

  // api call logic for get requests
  const [object, setObj] = useState();
  // set sidebar links
  const [links, setLinks] = useState({});
  const [linksDict, setLinksDict] = useState({});

  useEffect(() => {
    setLinksDict({
      ...(links.self && {'Request': `/requests/${request_id}`}),
      ...(links.to_parent_request && {'Parent Request': links.to_parent_request}),
      ...(links.child_requests && {'Child Requests': `/requests/${request_id}/child_requests`}),
      ...(links.project_details && {'Project Details': `/requests/${request_id}/project_details`}),
      ...(links.recipient && {'Recipient': `/requests/${request_id}/recipient`}),
      ...(links.notes && {'Notes': `/requests/${request_id}/notes`}),
      ...(links.language && {'Language': `/requests/${request_id}/language`}),
      //...(links.member && {'Member Details': `/requests/${request_id}/member`}),
      ...(links.members_requests && {'Member Requests': `/requests/${request_id}/members_requests`}),
      ...(links.files && {'Files': `/requests/${request_id}/files`}),
      //...(links.districts && {'Districts': `/requests/${request_id}/districts`}),
      ...(links.contact && {'Contact': `/requests/${request_id}/contact`}),
    });
  }, [links])

  const api = useApi();

  const [input, handleInputChange, changed, setChanged] = useInputChange();
  const [formErrors, setFormErrors] = useState({});

  const handleBlur = async (event) => {
    const key = event.target.id
    const value = input[key]
    if (!changed[event.target.id]) {
      ;
    } else {
      setChanged({});
      const data = await api.put(put_url, null, {
        body: {
          [key]: value,
          EditorID: localStorage.getItem('currentUserID'),
        }
      });
      if (!data.ok) {
        setFormErrors(data.body.errors.json);
      } else {
        setFormErrors({});
      }
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  
  const handleUnlinkClick = async () => {
    const response = await api.post(
      `${request_url}/remove_parent`, '', {
        body: {
          parent_id: object.ParentID
        }
      }
    )
    if (!response.ok) {
      console.log('Not ok!')
    }
    setObj(response.body)
  };
  // api call logic for updates
  const path = location.pathname;
  let ending = path.slice(path.lastIndexOf('/'));
  let put_url;
  if (object) {
    let project_id = object.ProjectID || null;
    let recipient_id = object.RecipientID || null;
    switch(ending) {
      case '/project_details':
        put_url = `/project_details/${project_id}`
        break;
      case '/recipient':
        put_url = `/recipients/${recipient_id}`
        break;
      default:
        put_url = request_url;
    }
  };

  const [showLinkOverlay, setShowLinkOverlay] = useState(false);
  const linkOverlay = LinkPopover({
    request_url, 
    setShowLinkOverlay, 
    isParent: object ? object.ParentStatus : false, 
    setObj,
    setLinks
  })

  return (
    <Modal
      show={show}
      dialogClassName="modal-90w"
      onHide={handleClose}
      animation={false}
      style={{zIndex: 95000}}
      enforceFocus={false}>

      <Modal.Header closeButton />
      <Modal.Body>
        <Body sidebar={linksDict} background={backgroundLocation}>
          {
            (object && object.length !== 0) ?
              <Stack direction="vertical" className="DetailHeading">
                <h1>
                  <Stack direction='horizontal' gap={3}>
                  <span>
                  #{object.SubmissionID}
                  &nbsp;&mdash;&nbsp;
                  {object.RequestTitle}
                  </span>
                  <>
                  {
                    object.DuplicateStatus === 'Duplicate' ?
                      <>
                        <div className='vr' />
                        <span>
                          {`Child of Request #${object.ParentSubmissionID}`}
                        </span>
                        <span className='LinkButton'>
                          <FaUnlink
                            style={{
                              display: 'block',
                              cursor: 'pointer',
                              hover: ''
                             }} 
                            onClick={handleUnlinkClick} />
                        </span>
                      </>
                      : 
                        <OverlayTrigger
                          show={showLinkOverlay}
                          trigger='click'
                          placement='bottom'
                          overlay={linkOverlay}
                        > 
                          <span className='LinkButton'> 
                            <FaLink 
                              style={{
                                display: 'block',
                                cursor: 'pointer',
                              }}
                              title={'Link to another request'}
                              onClick={() => setShowLinkOverlay(!showLinkOverlay)} />
                          </span>
                        </OverlayTrigger>
                  }
                  </>
                  </Stack>
                </h1>
                <h2>{object.Member}&nbsp;({object.Party})</h2>
                <Stack direction="horizontal" gap={2}>
                  <Stack 
                    direction="vertical" 
                    sm={6} 
                    className="DetailHeadingLeft">
                    
                    <RequestType request={object} />
                    <RankingsBadges
                      url={request_url}
                    />
                  </Stack>
                <RequestAccount url={request_url}/>
               </Stack>
              </Stack>

             :

            <Loader obj={object}/>}
            <Outlet context={
              [request_url,
              request_id,
              handleSubmit,
              handleBlur,
              handleInputChange,
              formErrors,
              setObj,
              setLinks]
            }/>
          </Body>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>

    </Modal>
  );
};

export default RequestModal;
