import { useState, useEffect } from 'react';

function EditableTableCell ({ getValue, row, column, table }) {

//function EditableTableCell ({ props }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

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
    <input 
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default EditableTableCell;
