import { useState } from 'react';
import useInputChange from '../useInputChange';

import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';

import InputField from './form/InputField';

function LanguageItemForm({ language, api }) {

  const language_url = (language ? `/language/${language.ID}` : '')
  const [formErrors, setFormErrors] = useState({});
  const [input, handleInputChange, changed, setChanged] = useInputChange();
  const handleBlur = async (event) => {
    const key = event.target.id;
    const value = input[key];
    if (!changed[key]) {
      ;
    } else {
      setChanged({});
      const data = await api.put(language_url, '', {
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
      <Stack direction="vertical" gap={1} className="LanguageItemForm">
        <Card.Title>
          <h5>
              {
                (language.BillReport && language.BillReport !== '') ?
                  language.BillReport + " Language:"
                  : "Language:"
              }
          </h5>
        </Card.Title>
        <Card.Body>
          <InputField
            defaultValue={language.Language}
            as_type="textarea"
            name="Language"
            rows={5}
            blurHandler={handleBlur}
            changeHandler={handleInputChange}
            error={formErrors.Language}
          />
        </Card.Body>
        <Card.Footer>
          <Stack direction="horizontal" gap={2} className="LanguageItemFooter">
            <p>
              <b>Created: </b>
              <>
              {
                (language.Creator && language.Creator !== '') ? language.Creator
                :
                "Placeholder"
              }
              </>
            </p>
            <p className="ms-auto">
              <b>Edited: </b>
              <>
                {
                  (language.Editor && language.Editor !== '') ? language.Editor
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

export default LanguageItemForm;
