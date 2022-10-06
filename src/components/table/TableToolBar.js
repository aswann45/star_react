import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import {
  BsFilterCircle,
  BsColumns,
  BsFilterCircleFill,
  BsArrowsCollapse,
  BsArrowsExpand,
  BsTools,
} from 'react-icons/bs'

import {
  FaToolbox,
  FaObjectGroup,
  FaRegFileExcel,
  FaSearch
} from 'react-icons/fa'
import { VscTools } from 'react-icons/vsc'

import ColumnVisibilityToggle from './ColumnVisibilityToggle';
import LoaderSmall from '../loaders/LoaderSmall';

function TableToolBar({
  tableInstance,
  showFilters,
  setShowFilters,
  rowSelection,
  fetchNewQuery,
  isFetching,
  totalItems,
  resetSearch,
  allowGrouping,
}) {

  const exportURLPrefix = tableInstance.options.meta?.exportURLPrefix;
  const cols = tableInstance.options.state?.columnVisibility;
  //console.log('cols', cols)
  const colVisKeys = Object.keys(
    tableInstance.options.state?.columnVisibility
  )
  //console.log('colVisKeys', colVisKeys)
  const colVis = colVisKeys.filter(key => cols[key] === false)
  //.filter(
    //key => key === false
  //);
  //console.log('colVis', colVis)
  const colList = tableInstance.options.state?.columnOrder.filter(
    (col) => !colVis.some((hiddenVal) => col === hiddenVal)
  )
  //console.log('colList', colList)
  const handleGroupingClick = () => {
    tableInstance.options.meta?.groupRequests(rowSelection);
    tableInstance.resetRowSelection(true);
  }

  const handleExportSelectedRowsClick = () => {
    tableInstance.options.meta?.exportRows(
      rowSelection,
      colList,
      exportURLPrefix
    );
    tableInstance.resetRowSelection(true);
  }

  const handleExportRowsClick = () => {
    tableInstance.options.meta?.exportRows(null, colList, exportURLPrefix);
    tableInstance.resetRowSelection(true);
  }

  return (
    <Stack className="TableToolBar" direction='horizontal' gap={2}>
      <Dropdown style={{width: 'auto'}}>
        <Dropdown.Toggle title='Tools'>
          <span>Tools&nbsp;</span>
          <span>
            <FaToolbox />
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{width: '180px'}}>

          {allowGrouping &&
            <Button
              onClick={handleGroupingClick}
              variant='light'
              size='sm'
              style={{width: '175px'}}
            >
              <span>Group&nbsp;Selected&nbsp;Rows&nbsp;</span>
              <span>
                <FaObjectGroup />
              </span>
            </Button>
          }
          <Button onClick={handleExportSelectedRowsClick}
            variant='light'
            size='sm'
            style={{width: '175px'}}
          >
            <span>Export&nbsp;Selected&nbsp;Rows&nbsp;</span>
            <span>
              <FaRegFileExcel />
            </span>
          </Button>
          <Button
            onClick={handleExportRowsClick}
            variant='light'
            size='sm'
            style={{width: '175px'}}
          >
            <span>Export&nbsp;All&nbsp;Rows&nbsp;</span>
            <span>
              <FaRegFileExcel />
            </span>
          </Button>

        </Dropdown.Menu>
      </Dropdown>

    {totalItems && totalItems > 0 ?
        <Button onClick={resetSearch}>
          <span>Reset Search&nbsp;</span>
          <span>
            <FaSearch />
          </span>
        </Button>
      : <Button onClick={fetchNewQuery}>
          <span>Fetch New Results&nbsp;</span>
          <span>
            <FaSearch />
          </span>
        </Button>
    }
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
