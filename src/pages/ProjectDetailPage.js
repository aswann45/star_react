import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
//import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import Body from '../components/Body';
import Container from 'react-bootstrap/Container';
import RankingsBadges from '../components/RankingsBadges';
import RequestType from '../components/RequestType';
import InputField from '../components/InputField';
import useInputChange from '../useInputChange';
import { useApi } from '../contexts/ApiProvider';
import { useParams } from 'react-router-dom';

function ProjectDetailPage() {
  const [formErrors, setFormErrors] = useState({});
  const { request_id } = useParams();

  const url = 'member_requests/' + request_id + '/project_details'

  const [input, handleInputChange, changed, setChanged] = useInputChange();
  
  const [object, setObj] = useState()

  const [links, setLinks] = useState()

  const api = useApi();

  const handleBlur = async (event) => {
    const key = event.target.id
    const value = input[key]
    const commit = `Committing ${value} for ${key}`;
    const non_commit = `would not commit ${event.target.id} here`;
    if (!changed[event.target.id]) {
      (console.log(non_commit));
    } else {
      (console.log(commit));
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
    <Body sidebar={links}>
      <>
        {object === undefined ?
          <Spinner animation="border" />
          :
          <>
            {object === null ?
              <p>Could not retrieve the object</p>
              :
              <>
                {object.length === 0 ?
                  <p>There was no object to display</p>
                  :
                  <>
                  <h1>{object.RequestTitle}</h1>
                  <Stack direction="horizontal" gap={3} className="DetailHeading">
                    <Container>
                      <RequestType request={object} />
                      <RankingsBadges request={object} />
                    </Container>
                    <Stack direction="vertical" className="RequestAccount">
                      <Container>
                        <div>
                          Agency:&nbsp;[Agency]
                        </div>
                        <div>
                          Account:&nbsp;[Account]
                        </div>
                        <div>
                          Program:&nbsp;[Program]
                        </div>
                      </Container>
                    </Stack>
                  </Stack>


                  <Form onSubmit={handleSubmit}>
                    <InputField
                      name="ChamberAmount"
                      label="$ Funded (House/Senate)"
                      defaultValue={object.ChamberAmount}
                      changeHandler={handleInputChange}
                      helperText="Amount funded in House or Senate bill. Appears in tables and reports."
                      blurHandler={handleBlur} 
                      error={formErrors.ChamberAmount} />
                    <InputField
                      name="ChamberAmountInternal"
                      label="Draft $ Funded (House/Senate)"
                      defaultValue={object.ChamberInternalAmount}
                      changeHandler={handleInputChange}
                      helperText="Nominal/draft amount to fund the CPF. Will NOT appear in tables or reports."
                      error={formErrors.ChamberInternalAmount}
                      blurHandler={handleBlur} />
                    <InputField
                      name="Explanation"
                      label="Project Explanation"
                      as_type="textarea"
                      defaultValue={object.Explanation}
                      changeHandler={handleInputChange}
                      helperText="Personal office rationale for providing the project with taxpayer funds."
                      blurHandler={handleBlur}
                      error={formErrors.Explanation}  />
                  </Form>
                  </>
                }
              </>
            }
          </>
        }
      </>
    </Body>
  );
}

export default ProjectDetailPage;
