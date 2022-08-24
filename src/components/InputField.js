import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

function handleKeyDown(event) {
  event.target.style.height = 'inherit';
  event.target.style.height = `${event.target.scrollHeight}px`;
}

function InputField(
  { name, label, type, placeholder, error, fieldRef, defaultValue, changeHandler, helperText, blurHandler, keyUpHandler, as_type, rows, horizontal }
) {
  return (
    <Form.Group controlId={name} className="InputField">
      {horizontal ?
        <Stack direction="horizontal" gap={2} className="InputFieldHorizontal">
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          type={type || 'text'}
          as={as_type}
          onKeyDown={as_type === 'textarea' ? handleKeyDown : undefined}
          onSelect={as_type === 'textarea' ? handleKeyDown : undefined}
          onLoad={(event) => event.target.style.height = `${event.target.scrollHeight}px`}
          placeholder={placeholder}
          ref={fieldRef}
          defaultValue={defaultValue}
          onChange={changeHandler}
          onBlur={blurHandler}
          onKeyUp={keyUpHandler}
        />
        <Form.Text className="text-danger">{error}</Form.Text>
        {helperText && <Form.Text>{helperText}</Form.Text>}
        </Stack>
      :
      <>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          type={type || 'text'}
          as={as_type}
          onKeyDown={as_type === 'textarea' ? handleKeyDown : undefined}
          onSelect={as_type === 'textarea' ? handleKeyDown : undefined}
          placeholder={placeholder}
          ref={fieldRef}
          defaultValue={defaultValue}
          onChange={changeHandler}
          onBlur={blurHandler}
          onKeyUp={keyUpHandler}
        />
        <Form.Text className="text-danger">{error}</Form.Text>
        {helperText && <Form.Text>{helperText}</Form.Text>}
      </>
   } 
      </Form.Group>
    
  );
}

export default InputField;
