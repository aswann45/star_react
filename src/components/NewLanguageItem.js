import { useState } from 'react';
import useInputChange from '../useInputChange';

import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import InputField from './form/InputField';
import InputSelect from './form/InputSelect';


function NewLanguageItem({ api, handleRemove, list_id, request_id }) {
    
  const language_url = '/language/'
  const [formErrors, setFormErrors] = useState({});
  const [input, handleInputChange] = useInputChange();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await api.post(language_url, '', {
      body: {
        HouseRequestID : request_id,
        BillReport: input.BillReport,
        Language: input.Language,
      }
    });
    if (!data.ok) {
      setFormErrors(data.body.errors.json);
    } else {
      setFormErrors({});
      handleRemove(list_id);
    }
  };
  return (
    <Card>
    <Stack direction="vertical" gap={1} className="LanguageItemForm">
      <Form onSubmit={handleSubmit}>
      <Card.Title>
          <h5>New Language:</h5>
          <InputSelect
            name="BillReport"
            label="Bill/Report Language"
            defaultValue={input.BillReport}
            error={formErrors.BillReport}
            changeHandler={handleInputChange}
          >
            <option hidden></option>
            <option value="Bill">Bill</option>
            <option value="Report">Report</option>
          </InputSelect>
      </Card.Title>
      <Card.Body>
        <InputField
          as_type="textarea"
          name="Language"
          rows={5}
          changeHandler={handleInputChange}
          error={formErrors.Language}
        />
      </Card.Body>
      <Card.Footer>
      <Stack direction="horizontal" gap={2} className="LanguageItemFooter">
        <Button 
          variant="primary"
          type="submit">
          Save New Language
        </Button>
        <Button 
          variant="danger" 
          onClick={() => handleRemove(list_id)}>
          Cancel
        </Button>
      </Stack>
      </Card.Footer>
      </Form>
    </Stack>
    </Card>
  );
}

export default NewLanguageItem;
