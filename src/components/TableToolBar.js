import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ColumnVisibilityToggle from './ColumnVisibilityToggle';
import { BsFilterCircle, BsColumns, BsFilterCircleFill, BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs'

function TableToolBar({ tableInstance, showFilters, setShowFilters, showColumnTools, setShowColumnTools, rowSelection, fetchNewQuery, fetchNextPage }) {

  return (
    <Stack className="TableToolBar" direction='horizontal' gap={2}> 
      <Button onClick={() => console.log(rowSelection)}>Log Row Selection</Button>
      <Button onClick={fetchNewQuery}>Fetch New Query</Button>
      <Button onClick={fetchNextPage}>Fetch Next Page</Button>
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
    </Stack>
  );
}

export default TableToolBar;
