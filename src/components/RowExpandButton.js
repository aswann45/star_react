import Button from 'react-bootstrap/Button';
import { BsChevronBarContract, BsChevronBarExpand } from 'react-icons/bs';
import LoaderSmall from './LoaderSmall'

function RowExpandButton({ row, table }) {
  
  const handleClick = (e) => {
    if (!row.original.subRows) {
      // if the row is missing it's subrows array, call the fetch
      // function and expand the row
      table.options.meta?.fetchChildRecords(row);
      row.toggleExpanded();
    } else {
      // just expand the row if it has it's subrows already
      row.toggleExpanded();
    }
  };
  
  return(
    <>
      {table?.options?.meta?.rowIsLoading?.[row.id] ? 
        <LoaderSmall /> :
        <>
          <Button
            {...{
              onClick: (e) => handleClick(),
              style: {cursor: 'pointer'},
              size: 'sm',
              variant: 'dark'
            }}
          >
            {row.getIsExpanded() ?
              <BsChevronBarContract /> :
              <BsChevronBarExpand /> 
            }
          </Button>
        </>
      }
    </>
  );
}

export default RowExpandButton;
