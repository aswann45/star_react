import { useState, useEffect, useCallback, useMemo } from 'react';
import Form from 'react-bootstrap/Form';



function EditableTableCell ({ getValue, row, column, table }) {

  const formatter = new Intl.NumberFormat('en-US');
//function EditableTableCell ({ props }) {
  const parsedInitialValue = useCallback((value) => {
    if (column.columnDef.inputType === 'currency') {
      const formattedValue = formatter.format(value);
      //console.log('Outer formatted value', formattedValue);
      if (formattedValue && !isNaN(formattedValue)) {
       // console.log('Original value', value)
       // console.log('Formatted value', formattedValue);
        return formattedValue;
      }
      return formattedValue;
    } else {
      return value;
    }
  }, [])

  //const v = getValue()
  //const initialValue = parsedInitialValue(v)
  const initialValue = useCallback(parsedInitialValue(getValue()), [getValue]);
  //const [initialValue, setInitialValue] = useState(parsedInitialValue(getValue()))
  //let initialValue = parsedInitialValue(getValue());
  //const initialValue = parsedInitialValue(getValue());
  //console.log(initialValue)
  const [value, setValue] = useState(initialValue);
  //const [textBoxHeight, setTextBoxHeight] = useState(42)


  const handleCurrencyFormat = (event) => {
    const parsed_value = parseInt(event.target.value.replace(/,/g, ''));
    const formatted_value = formatter.format(parsed_value);
    //console.warn(isNaN(parsed_value))

    event.target.value = !isNaN(parsed_value) ? formatted_value : '';
    //console.log(event.target.value)
    setValue(event.target.value);
  };


  const onBlur = () => {
    //console.log('blur')
    if (initialValue !== value) {
      table.options.meta?.updateData(row, column.id, value)
      //initialValue = value;
    };
  };

  const onChange = (e) => {
    setValue(e.target.value);
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

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
          column.columnDef.inputType === 'currency' ?
          <Form.Control
            value={value}
            onChange={handleCurrencyFormat}
            onBlur={onBlur}
            //onKeyUp={handleCurrencyFormat}
            style={{
                   width: 'inherit',
                   overflow: 'hidden',
                   whiteSpace: 'nowrap',
                   textOverflow: 'ellipsis',
                  }}
          />

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
