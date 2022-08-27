import Button from 'react-bootstrap/Button';
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

function ColumnSortToggleButton({ header }) {

  return (
    <>
    {header.column.getCanSort() &&
    <Button
      {...{
        className: header.column.getCanSort()
          ? 'cursor-pointer select-none'
          : '',
        onClick: header.column.getToggleSortingHandler(),
        variant: header.column.getIsSorted() ? 'secondary' : 'light',
        size: 'sm'
      }}
    >
      {!header.column.getIsSorted() ?
        <FaSort /> :
          header.column.getIsSorted() === 'asc' ?
            <FaSortUp /> :
          header.column.getIsSorted() === 'desc' ?
            <FaSortDown /> :
            null
      }
    </Button>
    }
    </>
  );
}


export default ColumnSortToggleButton;
