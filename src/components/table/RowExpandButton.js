import Button from 'react-bootstrap/Button';
import { BsChevronBarContract, BsChevronBarExpand } from 'react-icons/bs';
import LoaderSmall from '../loaders/LoaderSmall'

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
        <LoaderSmall style={{display: 'block'}}/> :
        row?.original?._links?.child_requests ?
        <>
          <span
            {...{
              onClick: (e) => handleClick(),
              style: {cursor: 'pointer'},
              size: 'sm',
              //variant: 'dark'
            }}
          >
            {row.getIsExpanded() ?
              <BsChevronBarContract style={{display: 'block'}}/> :
              <BsChevronBarExpand style={{display: 'block'}}/> 
            }
          </span> 
        </>
      : null
      }
    </>
  );
}

export default RowExpandButton;
