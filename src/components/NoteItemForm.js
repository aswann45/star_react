import { useState } from 'react';
import useInputChange from '../useInputChange';

import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';

import InputField from './form/InputField';


function NoteItemForm({ note, api }) {
    
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
          <h5>
              {
                (note.Type && note.Type !== '') ? 
                  note.Type + " Note:"
                  : "Note:"
              }
          </h5>
        </Card.Title>
        <Card.Body>
          <InputField
            defaultValue={note.Note}
            as_type="textarea"
            name="Note"
            rows={5}
            blurHandler={handleBlur}
            changeHandler={handleInputChange}
            error={formErrors.Note}
          />
        </Card.Body>
        <Card.Footer>
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
        </Card.Footer>
      </Stack>
    </Card>
  );
}

export default NoteItemForm;
