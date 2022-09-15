import { FaGripLinesVertical } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import { Fragment } from 'react';

const ColumnDragHandle = ({ header, dragRef }) => (
      <>
      {header.column.getIsPinned() ? 
        null :
        <span ref={dragRef} >
            <FaGripLinesVertical style={{display: 'block', opacity: 0.6, cursor: 'grab'}}/>
        </span>
      }
    </>
  );

export default ColumnDragHandle;
