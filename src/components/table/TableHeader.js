import { useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import useInputChange from '../../useInputChange';
import { flexRender } from '@tanstack/react-table';

import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import { BsFilterCircleFill } from 'react-icons/bs';

import ColumnDragHandle from './ColumnDragHandle';
import PinColumnToggleButton from './PinColumnToggleButton';
import DebouncedInput from './DebouncedInput';
import ColumnSortToggleButton from './ColumnSortToggleButton';



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
        
        
        <Stack direction='horizontal' gap={1}>
          <ColumnDragHandle dragRef={dragRef} header={header} />
          <PinColumnToggleButton header={header} />
          {header.isPlaceholder ? 
            null : 
            <span ref={previewRef}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </span>
          }
          {(header.column.getIsFiltered() && 
            column.columnDef.filterVariant === 'number' ? 
            // TODO: check this -- problem with typing in text box
            header.column.getFilterValue().some((item) => item?.trim().length > 0)
            : header.column.getFilterValue()
            ) &&
            // show filter circle if filtered
            <span>
             <BsFilterCircleFill style={{display: 'block'}}/>
            </span>
          }
          <ColumnSortToggleButton header={header}/>
        </Stack>


        {showColumnTools &&
          <Stack direction="horizontal" gap={2} className='ColumnTools'>

            
            
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
  /*
  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )*/

  const filterValues = useMemo(
    () =>
      typeof firstValue === 'number'
      ? []
      : column.columnDef.filterValues
      ? Array.from(column.columnDef.filterValues).sort()
      : Array.from(column.getFacetedUniqueValues().keys()).sort(),
      [column.getFacetedUniqueValues(), column.filterValues]
  )

  const [input, handleInputChange] = useInputChange();
  const [selectValues, setSelectValues] = useState();

  return column.columnDef.filterVariant === 'number' ? (
    <>
      <Stack direction={'horizontal'}>
        <DebouncedInput
          type='number'
          size='sm'
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          initialValue={(columnFilterValue)?.[0] || ''}
          //value={(columnFilterValue)?.[0] || ''}
          onChange={value => 
              column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
        />
        <DebouncedInput
          type='number'
          size='sm'
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          initialValue={(columnFilterValue)?.[1] || ''} 
          //value={(columnFilterValue)?.[1] || ''}
          onChange={value => 
              column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
        />

      </Stack>
      </>

      ) : (
        <>
      {/*<datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>*/}
      {column.columnDef.filterVariant === 'text'
        ? <>
            <DebouncedInput 
              type="text"
              size='sm'
              initialValue={(columnFilterValue ?? '')}
              onChange={value => column.setFilterValue(value)}
              placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
              //list={column.id + 'list'}
            />
          </>
        : column.columnDef.filterVariant === 'multi-select'
          ? <DebouncedInput 
              type="select"
              as='select'
              multiple
              htmlSize={4} 
              size='sm'
              initialValue={(columnFilterValue ?? null)}
              onChange={value => column.setFilterValue(value)}
            >
              {filterValues.map((value) => (
                <option title={value} value={value} key={value}>{value}</option>
              ))}
          </DebouncedInput>
          : null
      }
    </>
  );
}


export default TableHeader;
