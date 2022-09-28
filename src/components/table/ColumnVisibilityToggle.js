import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

function ColumnVisibilityToggle({ tableInstance}) {
  return (
      <Stack direction='vertical' className="ColumnVisibilityToggle">
        {/*<Form.Check
          {...{
            type: 'switch',
            label: 'Toggle All',
            checked: tableInstance.getIsAllColumnsVisible(),
            onChange: tableInstance.getToggleAllColumnsVisibility(), 
          }}
        />*/}
      {tableInstance.getAllLeafColumns().map(column => {
        return (
          <div key={column.id}>
            <Form.Check
              {...{
                type: 'switch',
                label: column.columnDef.header,
                checked: column.getIsVisible(),
                onChange: column.getToggleVisibilityHandler(),
              }}
            />
          </div>
        );
      })}
    </Stack>
  );
};

export default ColumnVisibilityToggle;
