import Button from 'react-bootstrap/Button';
import { BsPinFill, BsPinAngle } from 'react-icons/bs';

function PinColumnToggleButton ({ header }) {
  return (
    <>
      {!header.isPlaceholder && header.column.getCanPin() && (
        <>
          {header.column.getIsPinned() !== 'left' ? (
            <span 
              variant={'light'} 
              size={'sm'} 
              onClick={() => {header.column.pin('left')}}
            >
              <BsPinAngle style={{display: 'block'}}/>
            </span>
      ) : null}
          {header.column.getIsPinned() ? (
            <span 
              variant={'secondary'} 
              size={'sm'} 
              onClick={() => {header.column.pin(false)}}
            >
              <BsPinFill style={{display: 'block'}}/>
            </span>
          ) : null}
        </>
      )}
    </>
  );
};

export default PinColumnToggleButton;
