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
    <>  
      {(props.type && props.type === 'select') ?
      <Form.Control 
        value={value ?? []} 
        onChange={e => setValue(
          [...e.target.options].filter(o => o.selected).length > 0 ? 
          [...e.target.options].filter(o => o.selected).map(o => o.value)
          : null
        )}
        {...props} 
          
      />
      :
        <Form.Control 
          value={value} 
          {...props} 
          onChange={e => setValue(e.target.value)} 
        />
      }
    </>
  );
}

export default DebouncedInput;
