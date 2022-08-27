import Button from 'react-bootstrap/Button';
import { BsPinFill, BsPinAngle } from 'react-icons/bs';

function PinColumnToggleButton ({ header }) {
  return (
    <>
      {!header.isPlaceholder && header.column.getCanPin() && (
        <>
          {header.column.getIsPinned() !== 'left' ? (
            <Button 
              variant={'light'} 
              size={'sm'} 
              onClick={() => {header.column.pin('left')}}
            >
              <BsPinAngle />
            </Button>
      ) : null}
          {header.column.getIsPinned() ? (
            <Button 
              variant={'secondary'} 
              size={'sm'} 
              onClick={() => {header.column.pin(false)}}
            >
              <BsPinFill />
            </Button>
          ) : null}
        </>
      )}
    </>
  );
};

export default PinColumnToggleButton;
