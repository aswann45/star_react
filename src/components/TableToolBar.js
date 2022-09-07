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
  showColumnTools, 
  setShowColumnTools, 
  rowSelection, 
  fetchNewQuery, 
  isFetching,
  nextPageToFetch,
  totalItems,
  fetchedItems,
  refreshData,
}) {
  return (
    <Stack className="TableToolBar" direction='horizontal' gap={2}> 
      <Button onClick={() => console.log(rowSelection)}>Log Row Selection</Button>
      {((fetchedItems === 0 && nextPageToFetch === null) || nextPageToFetch === 1) ?
        <Button onClick={fetchNewQuery}>Fetch New Query</Button>
        :
        <Button onClick={refreshData}>Refresh Data</Button>
      }
      <Dropdown>
        <Dropdown.Toggle 
          title='Toggle Visible Columns'
        >Columns&nbsp;
          <BsColumns />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <ColumnVisibilityToggle tableInstance={tableInstance} />
        </Dropdown.Menu>
      </Dropdown>
            <Button
        active={false}
        title='Show/Hide Column Tools'
        onClick={() => setShowColumnTools(showColumnTools === true ? false : true)}>
        Column Tools&nbsp;
        {showColumnTools ?
          <BsArrowsCollapse /> :
          <BsArrowsExpand />
        }
      </Button>
      <Button
        active={false}
        title='Show/Hide Column Filters'
        onClick={() => setShowFilters(showFilters === true ? false : true)}>
        Filters&nbsp;
        {showFilters ?
          <BsFilterCircleFill /> :
          <BsFilterCircle />
        }
      </Button>
      <Button onClick={() => tableInstance.resetColumnFilters(true)}>
        Clear All Filters
      </Button>
        {(totalItems && fetchedItems) &&
        <span>Loaded {fetchedItems} of {totalItems}</span>
        }
        {isFetching && 
          <div className='ms-auto' >
            <LoaderSmall />
          </div>
        }
    </Stack>
  );
}

export default TableToolBar;
