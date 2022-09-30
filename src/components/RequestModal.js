import { useState, useEffect } from 'react';
import { Outlet,  useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import useInputChange from '../useInputChange';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Stack from 'react-bootstrap/Stack';
import Body from './navigation/Body';
import RankingsBadges from './RankingsBadges';
import RequestType from './RequestType';
import RequestAccount from './RequestAccount';
import Loader from './loaders/Loader';

function RequestModal() {
  const { request_id } = useParams(':request_id');
  const request_url = `/requests/${request_id}`;
  const location = useLocation();
  const backgroundLocation = location.state.backgroundLocation;
  //console.log(location.state)
  const navigate = useNavigate();
  
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    navigate(backgroundLocation);
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
          [key]: value  
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
  
  
  return (
    <Modal
      show={show} 
      dialogClassName="modal-90w"
      onHide={handleClose} 
      animation={false}
      style={{zIndex: 95000}}>
        
      <Modal.Header closeButton />
      <Modal.Body>
        <Body sidebar={linksDict} background={backgroundLocation}>
          {(object && object.length !== 0) ?
            
            
              <Stack direction="vertical" className="DetailHeading">
                <h1>
                  #{object.SubmissionID}
                  &nbsp;&mdash;&nbsp;
                  {object.RequestTitle}
                </h1>
                <h2>{object.Member}&nbsp;({object.Party})</h2>
                <Stack direction="horizontal" gap={2}>
                  <Stack direction="vertical" sm={6} className="DetailHeadingLeft">
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