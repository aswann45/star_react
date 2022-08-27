import { useMemo } from 'react';
import ColumnDragHandle from './ColumnDragHandle';
import PinColumnToggleButton from './PinColumnToggleButton';
import { useDrag, useDrop } from 'react-dnd';
import { flexRender } from '@tanstack/react-table';
import Stack from 'react-bootstrap/Stack';
import DebouncedInput from './DebouncedInput';
import ColumnSortToggleButton from './ColumnSortToggleButton';
import { BsFilterCircleFill } from 'react-icons/bs';

function TableHeader({ tableInstance, showFilters, showColumnTools }) {
  return (
    <>
      <thead> 
        {tableInstance.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <DraggableTableHeader 
                tableInstance={tableInstance} 
                header={header} 
                key={header.id}
                className='DraggableTableHeader'
                showFilters={showFilters}
                showColumnTools={showColumnTools}
              />
            ))}
          </tr>
        ))}
      </thead>
    </>
  );
}

// Column reordering logic
const reorderColumn = (
  draggedColumnId,
  targetColumnId,
  columnOrder
) => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0]
  );
  return [...columnOrder];
};

const DraggableTableHeader = ({ tableInstance, header, showFilters, showColumnTools }) => {
  const { getState, setColumnOrder } = tableInstance;
  const { columnOrder } = getState();
  const { column } = header;
  const [{ isOver }, dropRef] = useDrop({
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
    accept: 'column',
    drop: (draggedColumn) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      );
      setColumnOrder(newColumnOrder);
    },
  });
  
  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  });

  return (
    <>
      <th
        ref={dropRef}
        colSpan={header.colSpan}
        style={{ 
          opacity: isDragging ? 0.5 : 1, 
          backgroundColor: isOver ? '#e9ecef' : '#ddd',
          position: 'sticky',
          top: 0,
          //zIndex: 99999,
          width: header.getSize(),
        }}
      >
        <span 
          ref={previewRef}
        >
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          {header.column.getIsFiltered() && 
            <>
             &nbsp;<BsFilterCircleFill />
            </>
          }
        </span>
        {showColumnTools &&
          <Stack direction="horizontal" gap={2} className='ColumnTools'>
            <ColumnDragHandle dragRef={dragRef} header={header} />
            <PinColumnToggleButton header={header} />
            <ColumnSortToggleButton header={header} />
          </Stack>
        }
        {header.column.getCanFilter() && showFilters ? (
          <>
            <Filter column={header.column} table={tableInstance} />
          </>
        ) : null}
        <div 
          {...{
            onMouseDown: header.getResizeHandler(),
            className: `Resizer ${
              header.column.getIsResizing() ? 'isResizing' : ''
            }`
          }}
        />
      </th>
    </>
  );
};

function Filter ({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput 
        type="text"
        initialValue={(columnFilterValue ?? '')}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        list={column.id + 'list'}
      />
    </>
  );
}


export default TableHeader;
