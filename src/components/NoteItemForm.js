import { useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputField from './InputField';
import InputSelect from './InputSelect';
import useInputChange from '../useInputChange';

function NoteItemForm({ note, api, new_note, handleCancelNote, key_id, newNotes }) {
    
  const note_url = (note ? note._links.self : '')
  const [formErrors, setFormErrors] = useState({});
  const [input, handleInputChange, changed, setChanged] = useInputChange();
  const handleBlur = async (event) => {
    const key = event.target.id;
    const value = input[key];
    if (!changed[key]) {
      ;
    } else {
      setChanged({});
      const data = await api.put(note_url, '', {
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

  return (
    <Card>
    <Stack direction="vertical" gap={1} className="NoteItemForm">
      <Card.Title>
        <>
        {new_note ?
          <>
          <h5>New Note:</h5>
          <InputSelect
            name="Type"
            label="Type"
            error={formErrors.Type}
            changeHanlder={handleInputChange}
          >
            <option hidden></option>
            <option>Flag</option>
            <option>House Disposition</option>
            <option>Conference Disposition</option>
            <option>Agency Feedback</option>
            <option>Revision</option>
            <option>Transfer</option>
            <option>General/Other</option>
          </InputSelect>
          </>
        :
        <h5>
            {(note.Type && note.Type !== '') ? 
                note.Type + " Note:"
                : "Note:"
            }
        </h5>
        }
        </>
      </Card.Title>
      <Card.Body>
        <>
        {new_note ?
          <p>Different handling for input changes here</p>
          :
        <InputField
          defaultValue={note.Note}
          as_type="textarea"
          name="Note"
          rows={5}
          blurHandler={handleBlur}
          changeHandler={handleInputChange}
          error={formErrors.Note}
        />
          }
        </>
      </Card.Body>
      <Card.Footer>
        <>
        {note ?
      <Stack direction="horizontal" gap={2} className="NoteItemFooter">
          <p>
            <b>Created: </b>
            <>
            {
              (note.Creator && note.Creator !== '') ? note.Creator
              :
              "Placeholder"
            }
          </>
          </p>
          <p className="ms-auto">
            <b>Edited: </b>
            <>
              {
                (note.Editor && note.Editor !== '') ? note.Editor
                :
                "Placeholder"
              }
            </>
          </p>
      </Stack>
          :
      <Stack direction="horizontal" gap={2} className="NoteItemFooter">
          <p>Placeholder footer here</p>
        <Button onClick={() => handleCancelNote(key_id, newNotes)} variant="danger">Cancel {key_id}</Button>
      </Stack>
        }
        </>
      </Card.Footer>
    </Stack>
    </Card>
  );
}

export default NoteItemForm;
