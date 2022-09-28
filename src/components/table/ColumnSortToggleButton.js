import Button from 'react-bootstrap/Button';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

function ColumnSortToggleButton({ header }) {

  return (
    <>
    {header.column.getCanSort() &&
    <span
      {...{
        className: header.column.getCanSort() ? 
          'cursor-pointer select-none ms-auto' : 
          '',
        onClick: header.column.getToggleSortingHandler(),
        variant: header.column.getIsSorted() ? 'secondary' : 'light',
      }}
    >
      {!header.column.getIsSorted() ?
        <FaSort style={{display: 'block'}}/> :
          header.column.getIsSorted() === 'asc' ?
            <FaSortUp style={{display: 'block'}}/> :
          header.column.getIsSorted() === 'desc' ?
            <FaSortDown style={{display: 'block'}}/> :
            null
      }
    </span>
    }
    </>
  );
}


export default ColumnSortToggleButton;
