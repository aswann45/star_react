import { useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form';

function RowSelectCheckbox({ indeterminate, className='', ...rest }) {

  const ref = useRef(null);
  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    };
  }, [ref, indeterminate]);

  return(
    <Form.Check 
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
};

export default RowSelectCheckbox;