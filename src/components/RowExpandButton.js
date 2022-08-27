import Button from 'react-bootstrap/Button';
import { BsChevronBarContract, BsChevronBarExpand } from 'react-icons/bs';

function RowExpandButton({ row }) {
  return(
    <Button
      {...{
        onClick: row.getToggleExpandedHandler(),
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
  );
}

export default RowExpandButton;
