import { useState, useEffect } from 'react';
import { Outlet, useOutletContext, useLocation } from 'react-router-dom';
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


function DetailModal() {
  // router outlet context
  const [endpoint, ID, show, setShow, setIsDetail] = useOutletContext();
  // hide modal
  const handleClose = () => {
    setShow(false);
    setIsDetail(false);
  };
  

  //console.log('Endpoint', endpoint)
  
  // api call logic for get requests
  const [object, setObj] = useState();
  // set sidebar links
  const [links, setLinks] = useState({});
  const [linksDict, setLinksDict] = useState({});
  
  useEffect(() => {
    setLinksDict({
      ...(links.self && {'Request': links.self}),
      ...(links.to_parent_request && {'Parent Request': links.to_parent_request}),
      ...(links.child_requests && {'Child Requests': links.child_requests}),
      ...(links.project_details && {'Project Details': links.project_details}),
      ...(links.recipient && {'Recipient': links.recipient}),
      ...(links.notes && {'Notes': links.notes}),
      ...(links.language && {'Language': links.language}),
      ...(links.member && {'Member Details': links.member}),
      ...(links.members_requests && {'Member Requests': links.members_requests}),
      ...(links.files && {'Files': links.files}),
      ...(links.districts && {'Districts': links.districts}),
      ...(links.contact && {'Contact': links.contact}),
    });
  }, [links])

  const api = useApi();
  /*useEffect(() => {
    (async () => {
      console.log('modal get request')
      const response = await api.get(endpoint);
      setObj(response.ok ? response.body : null);
      setLinks(response.ok ? response.body._links : null)
    })();
  }, [api, endpoint]);*/
  
  // input handler; check if updated before committing
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
  const location = useLocation();
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
        put_url = endpoint;
    }
  };
  
  // 
  
  return (
    <>
      <Modal 
        //fullscreen
        show={show} 
        onHide={handleClose} 
        animation={false} 
        style={{zIndex: 95000,}}>
          
        <Modal.Header closeButton />
          
        <Modal.Body>
          <Body sidebar={linksDict}>
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
                      url={endpoint} 
                    />
                  </Stack>
                <RequestAccount object_id={object.ID}/>
               </Stack>
              </Stack>
               
             :

            <Loader obj={object}/>} 
            <Outlet context={[endpoint, ID, handleSubmit, handleBlur, handleInputChange, formErrors, setObj, setLinks]}/>  
          </Body>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
};

export default DetailModal;