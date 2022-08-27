import { FaGripLinesVertical } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';

const ColumnDragHandle = ({ header, dragRef }) => (
      <>
      {
        header.column.getIsPinned() 
        ? null 
        :
          <Button 
            variant={'light'}
            size={'sm'}
            ref={dragRef}
          >
            <FaGripLinesVertical />
          </Button>
      }
    </>
  );

export default ColumnDragHandle;
