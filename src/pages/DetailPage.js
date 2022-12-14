import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useParams, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import useInputChange from '../useInputChange';

import Stack from 'react-bootstrap/Stack';
import Body from '../components/navigation/Body';
import RankingsBadges from '../components/RankingsBadges';
import RequestType from '../components/RequestType';
import RequestAccount from '../components/RequestAccount';
import Loader from '../components/loaders/Loader';


import RequestDetailForm from '../components/RequestDetailForm';
import ProjectDetailForm from '../components/ProjectDetailForm';
import RecipientDetailForm from '../components/RecipientDetailForm';



import RequestList from '../components/RequestList';
import NotesDetail from '../components/NotesDetail';
import LanguageDetail from '../components/LanguageDetail';
import RequestContactDetail from '../components/RequestContactDetail';
import FilesDetail from '../components/FilesDetail';

function DetailPage() {
  const [formErrors, setFormErrors] = useState({});
  const { request_id } = useParams();

  const url = '/member_requests/' + request_id

  const location = useLocation();


  const [input, handleInputChange, changed, setChanged] = useInputChange();
  
  const [object, setObj] = useState();
  const [links, setLinks] = useState({});
  const [linksDict, setLinksDict] = useState({});

  const api = useApi();

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

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      setObj(response.ok ? response.body : null);
      setLinks(response.ok ? response.body._links : null)
    })();
  }, [api, url]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const path = location.pathname;
  let ending = path.slice(path.lastIndexOf('/'));
  let put_url;
  if (object) {
    let project_id = object.ProjectID;
    let recipient_id = object.RecipientID;
    switch(ending) {
      case '/project_details':
        put_url = `/project_details/${project_id}`
        break;
      case '/recipient':
        put_url = `/recipients/${recipient_id}`
        break;
      default:
        put_url = url;
    }
  };



  return (
    <>
      {(object && object.length !== 0) ?
        <Body sidebar={linksDict}>
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
                url={url} 
              />
            </Stack>
            <RequestAccount object_id={object.ID}/>
           </Stack>
          </Stack>
          <RequestDetailForm 
            handleSubmit={handleSubmit}
            handleBlur={handleBlur}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
            title="Request Details"
          />
        </Body>
      :
      <Loader obj={object}/>
      }
    </>
      
  );
}

export default DetailPage;
