import { useState } from 'react';

function ReadOnlyTableCell({ getValue }, ...options) {

  const [value, setValue] = useState(getValue() || '')

  options?.join ?? setValue(...value.join(options?.join))

  return (
    <>
      <input style={{
             width: 'inherit',
             overflow: 'hidden',
             whiteSpace: 'nowrap',
             textOverflow: 'ellipsis',
             borderStyle: 'none',
             backgroundColor: 'transparent'
           }}
           value={value}
           readOnly
           disabled />
    </>
  )
}

export default ReadOnlyTableCell;
