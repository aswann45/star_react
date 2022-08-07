import { useState, useEffect, useRef } from 'react';
import Stack from 'react-bootstrap/Stack';
import Body from '../components/Body';
import Container from 'react-bootstrap/Container';
import RankingsBadges from '../components/RankingsBadges';
import RequestType from '../components/RequestType';
import useInputChange from '../useInputChange';
import { useApi } from '../contexts/ApiProvider';
import { useParams, Routes, Route } from 'react-router-dom';
import RequestDetailForm from '../components/RequestDetailForm';
import ProjectDetailForm from '../components/ProjectDetailForm';
import RecipientDetailForm from '../components/RecipientDetailForm';
import Loader from '../components/Loader';
import RequestAccount from '../components/RequestAccount';

function DetailPage() {
  const [formErrors, setFormErrors] = useState({});
  const { request_id } = useParams();

  const url = '/member_requests/' + request_id

  const [input, handleInputChange, changed, setChanged] = useInputChange();
  
  const [object, setObj] = useState()

  const [links, setLinks] = useState()

  const api = useApi();

  const handleBlur = async (event) => {
    const key = event.target.id
    const value = input[key]
    if (!changed[event.target.id]) {
      ;
    } else {
      setChanged({});
      const data = await api.put(url, null, {
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

  const handleSubmit = (event) => {
    event.preventDefault();
  };


  return (
    <>
      {(object && object.length !== 0) ?
        <Body sidebar={links}>
          <h1>{object.RequestTitle}</h1>
          <Stack direction="horizontal" gap={3} className="DetailHeading">
            <Container>
              <RequestType request={object} />
              <RankingsBadges request={object} />
            </Container>
            <RequestAccount object={object}/>
           </Stack>
          <Routes>
            <Route path=":request_id/project_details"
              element={<ProjectDetailForm
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                handleInputChange={handleInputChange}
                formErrors={formErrors} 
              />} 
            />
            <Route path=":request_id/recipient"
              element={<RecipientDetailForm
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                handleInputChange={handleInputChange}
                formErrors={formErrors} 
              />} 
            />
            <Route path=":request_id"
              element={<RequestDetailForm 
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                handleInputChange={handleInputChange}
                formErrors={formErrors}
              />} 
            />
          </Routes>
        </Body>
      :
      <Loader obj={object}/>
      }
    </>
      
  );
}

export default DetailPage;
