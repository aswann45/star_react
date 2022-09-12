import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';

function EditableTableCell ({ getValue, row, column, table }) {

//function EditableTableCell ({ props }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  //const [textBoxHeight, setTextBoxHeight] = useState(42)

  const onBlur = () => {
    //console.log('blur')
    if (initialValue !== value) {
      table.options.meta?.updateData(row, column.id, value)
    }; 
  };

  const onChange = (e) => {
    setValue(e.target.value);
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue]);

  return (
    
    <>
    {column.columnDef.inputType === 'textarea' ? 
      <Form.Control
        as={'textarea'}
        rows={1}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{
               width: 'inherit',
               textOverflow: 'ellipsis',
              }}
      />
      :
        column.columnDef.inputType === 'multi-select' ? 
          <Form.Select 
            size='sm'
            onChange={onChange}
            onBlur={onBlur}
            value={value}
          >
              <option value='' hidden></option>
            {column.columnDef.inputValues.map((value) => (
              <option title={value} value={value} key={value}>{value}</option>
            ))}
              <option value={null}>None</option>
          </Form.Select>
        :
          <Form.Control
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            style={{
                   width: 'inherit',
                   overflow: 'hidden',
                   whiteSpace: 'nowrap',
                   textOverflow: 'ellipsis',
                  }}
          />
  }
  </>
  );
};

export default EditableTableCell;
