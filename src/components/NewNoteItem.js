import { useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputField from './InputField';
import InputSelect from './InputSelect';
import useInputChange from '../useInputChange';

function NewNoteItem({ api, handleRemove, list_id, request_id }) {
    
  const note_url = '/notes/'
  const [formErrors, setFormErrors] = useState({});
  const [input, handleInputChange] = useInputChange();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await api.post(note_url, '', {
      body: {
        RequestID : request_id,
        Type: input.Type,
        Note: input.Note,
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
    <Stack direction="vertical" gap={1} className="NoteItemForm">
      <Form onSubmit={handleSubmit}>
      <Card.Title>
          <h5>New Note:</h5>
          <InputSelect
            name="Type"
            label="Type"
            defaultValue={input.Type}
            error={formErrors.Type}
            changeHandler={handleInputChange}
          >
            <option hidden></option>
            <option value="Flag">Flag</option>
            <option value="House Disposition">House Disposition</option>
            <option value="Conference Disposition">Conference Disposition</option>
            <option value="Agency Feedback">Agency Feedback</option>
            <option value="Revision">Revision</option>
            <option value="Subcommittee Transfer">Subcommittee Transfer</option>
            <option value="General/Other">General/Other</option>
          </InputSelect>
      </Card.Title>
      <Card.Body>
        <InputField
          as_type="textarea"
          name="Note"
          rows={5}
          changeHandler={handleInputChange}
          error={formErrors.Note}
        />
      </Card.Body>
      <Card.Footer>
      <Stack direction="horizontal" gap={2} className="NoteItemFooter">
        <Button 
          variant="primary"
          type="submit">
          Save New Note
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

export default NewNoteItem;
