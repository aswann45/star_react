import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import InputField from '../components/InputField';
import { useLocation } from 'react-router-dom';

function RequestDetailForm({ handleSubmit, handleBlur, handleInputChange, formErrors }) {

  const location = useLocation();
  const [object, setObject] = useState();
  const api = useApi();
  const url = location.pathname;

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      setObject(response.ok ? response.body : null);
    })();
  }, [api, url]);

  return (
    <>
      {object === undefined ? 
        <Spinner animation="border" />
        :
        <>
          {object === null ? 
            <p>Could not retrieve request details.</p>
            :
            <>
              {object.length === 0 ?
                <p>There are no request details to display.</p>
                :
                <>
                  <Form onSubmit={handleSubmit}>
                    <InputField
                      name="RequestTitle"
                      label="Request Title"
                      defaultValue={object.RequestTitle}
                      changeHandler={handleInputChange}
                      helperText="Request title from the personal office."
                      blurHandler={handleBlur} 
                      error={formErrors.RequestTitle} />
                    <InputField
                      name="RequestTitle"
                      label="Analyst/Stubline Title"
                      defaultValue={object.RequestTitle}
                      changeHandler={handleInputChange}
                      helperText="Appropriations staff-set title for reports and tables."
                      error={formErrors.RequestTitle}
                      blurHandler={handleBlur} />
                    <InputField
                      name="RequestSummary"
                      label="Request Summary"
                      as_type="textarea"
                      defaultValue={object.RequestSummary}
                      changeHandler={handleInputChange}
                      helperText="Appropriations staff summary for reports."
                      blurHandler={handleBlur}
                      error={formErrors.RequestSummary}  />
                    <InputField
                      name="RequestDescription"
                      label="Request Description"
                      as_type="textarea"
                      defaultValue={object.RequestDescription}
                      changeHandler={handleInputChange}
                      helperText="Request description provided by the personal office."
                      error={formErrors.RequestDescription}
                      blurHandler={handleBlur} />
                  </Form>
                </>
              }
            </>
          }
        </>
      }
    </>
  );
}

export default RequestDetailForm;
