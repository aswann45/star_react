import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ColumnVisibilityToggle from './ColumnVisibilityToggle';
import LoaderSmall from './LoaderSmall';
import { BsFilterCircle, BsColumns, BsFilterCircleFill, BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs'

function TableToolBar({ 
  tableInstance, 
  showFilters, 
  setShowFilters, 
  rowSelection, 
  fetchNewQuery, 
  isFetching,
}) {
  return (
    <Stack className="TableToolBar" direction='horizontal' gap={2}> 
      
      <Button onClick={() => console.log(rowSelection)}>Log Row Selection</Button>
      <Button onClick={fetchNewQuery}>Fetch New Results</Button>

      <Dropdown>
        <Dropdown.Toggle title='Toggle Visible Columns'>
          
            <span>Columns&nbsp;</span>
            <span>
              <BsColumns />
            </span>
          
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <ColumnVisibilityToggle tableInstance={tableInstance} />
        </Dropdown.Menu>

      </Dropdown>

      <Button
        active={false}
        title='Show/Hide Column Filters'
        onClick={() => setShowFilters(showFilters === true ? false : true)}>
        
        {showFilters ?
         <Stack direction='horizontal'>
           <span>Hide Filters&nbsp;</span>
           <BsFilterCircleFill style={{display: 'block'}}/> 
         </Stack> :
         <Stack direction='horizontal'>
           <span>Show Filters&nbsp;</span>
           <BsFilterCircle style={{display: 'block'}}/>
         </Stack>
        }
      </Button>

      <Button onClick={() => tableInstance.resetColumnFilters(true)}>
        Clear All Filters
      </Button>
      
        {/*(totalItems && fetchedItems) &&
        <span>Loaded {fetchedItems} of {totalItems}</span>
        */}
        {isFetching && 
          <div className='ms-auto' >
            <LoaderSmall />
          </div>
        }
    </Stack>
  );
}

export default TableToolBar;
