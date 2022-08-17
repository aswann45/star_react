import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

function InputSelect(
  { name, label, error, fieldRef, defaultValue, changeHandler, helperText, children }
) {

  return(
    <> 
          <Form.Group controlId={name} className="InputSelect">
            <Stack direction="horizontal" gap={3}>
              {label && <Form.Label>{label}</Form.Label>}
              <Form.Select
                value={defaultValue}
                onChange={changeHandler}
                ref={fieldRef}>
                {children}
              </Form.Select>
              <Form.Text className="text-danger">{error}</Form.Text>
              {helperText &&
              <Form.Text>{helperText}</Form.Text>
              }
            </Stack>
          </Form.Group>
    </>
  );
}

export default InputSelect;
