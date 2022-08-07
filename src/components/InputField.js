import Form from 'react-bootstrap/Form';

function InputField(
  { name, label, type, placeholder, error, fieldRef, defaultValue, changeHandler, helperText, blurHandler, as_type }
) {
  return (
    <Form.Group controlId={name} className="InputField">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type || 'text'}
        as={as_type}
        placeholder={placeholder}
        ref={fieldRef}
        defaultValue={defaultValue}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
      <Form.Text className="text-danger">{error}</Form.Text>
      {helperText && <Form.Text>{helperText}</Form.Text>}
    </Form.Group>
  );
}

export default InputField;
