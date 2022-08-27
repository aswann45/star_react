import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';

function DebouncedInput({ initialValue, onChange, debounce=500, ...props }) {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce);

    return () => clearTimeout(timeout)

  }, [value])

  return (
    <Form.Control {...props} value={value} onChange={e => setValue(e.target.value)} />
  );
}

export default DebouncedInput;
