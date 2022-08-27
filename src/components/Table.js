import { useState, useEffect, useRef, useMemo } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useSearchParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { 
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Loader from './Loader';
import { useVirtualizer } from '@tanstack/react-virtual';
import MemberRequestsColumns from './table_columns/MemberRequestsColumns';
import TableHeader from './TableHeader';
import TableToolBar from './TableToolBar';

// imported columns for Member Requests
const columns = MemberRequestsColumns;

function DataTable() {
  // URL and API request logic and state
  const [searchParams, setSearchParams] = useSearchParams();

  const api = useApi();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState();
  const [firstFetch, setFirstFetch] = useState(true);
  const [canFetchFirst, setCanFetchFirst] = useState(true);
  const [isFetchingFirst, setIsFetchingFirst] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [nextPage, setNextPage] = useState();
  const [showLoader, setShowLoader] = useState(true);
  const [links, setLinks] = useState();
  const url = '/member_requests/';
  const fetchNextAbortController = new AbortController();
  // Column visibility, pinning, and order state
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnPinning, setColumnPinning] = useState({});
  const [columnOrder, setColumnOrder] = useState(
    columns.map(column => column.accessorKey ?? column.id)
  );

  // column toolbar visibilities
  const [showFilters, setShowFilters] = useState(true);
  const [showColumnTools, setShowColumnTools] = useState(true);

  // column resizing
  const [columnResizeMode, setColumnResizeMode] = useState('onChange');
  
  // column filters
  const [columnFilters, setColumnFilters] = useState();
  const [globalFilter, setGlobalFilter] = useState('');


  useEffect(() => {
    //fetchNextAbortController.abort();
    setSearchParams({
      limit: 100,
      //filters: JSON.stringify(columnFilters ?? []),
      filters: JSON.stringify(columnFilters ?? []),
      page: 1,
    });
  }, [
      columnFilters, 
      setSearchParams, 
    ]
  );
    
  useEffect(() => {
    fetchNextAbortController.abort();
    console.log('Resetting fetch states')
    setIsFetchingNext(false);
    setCanFetchFirst(true);
    setNextPage();
  }, [searchParams])

  // sorting
  const [sorting, setSorting] = useState([]);

  // row selection
  const [rowSelection, setRowSelection] = useState({});
  const getRowId = (originalRow, relativeIndex, parent) => {
    return parent ? [parent.ID, originalRow.ID].join('.') : originalRow.ID;
  }

  //sub rows
  const [expanded, setExpanded] = useState({});
  const getSubRowsFx = (originalRow, index) => {
    return originalRow.children.length > 0 && originalRow.children;
  }

  // Table instance
  //
  const tableInstance = useReactTable({ 
    data,
    columns,
    columnResizeMode,
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
      columnFilters,
      globalFilter,
      sorting,
      rowSelection,
      expanded,
    },
    getRowId,
    getSubRows: row => row.children,
    manualFiltering: true,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(), 
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

     
  // virtualized rows
  //
  const totalItemsCount = meta && meta.total_items;
  const tableContainerRef = useRef();
  const { rows } = tableInstance.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: totalItemsCount && totalItemsCount,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 41,
    overscan: 15,
  });

  const totalSize = rowVirtualizer.getTotalSize();
  const virtualRows = rowVirtualizer.getVirtualItems();
  //console.log('Virtual rows length:', virtualRows.length -1) 

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom = 
    virtualRows.length > 0
    ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end)
    : 0

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchNewData = async () => {
      if (firstFetch) {
        setFirstFetch(false);
        return true
      }
      if (!searchParams.get('filters')) {
        return
      };
      if (searchParams.get('page') > 1) {
        return
      }

      console.log('Refetching new set...');      
      
      const response = await api.get(
        url,
        searchParams,
        {signal: signal}
      );

      if (response.ok) {
        abortController.abort();
        fetchNextAbortController.abort();
        setData([]);
        setLinks();
        setMeta();
        setRowSelection({});
        setNextPage(null);
      }

      setData(response.ok ? response.body.data : null);
      setMeta(response.ok ? response.body._meta : null);
      setLinks(response.ok ? response.body._links : null);
      setNextPage(response.ok ? (
        Array.from(
          Array(response.body._meta.total_pages).keys(), 
          (n) => n !== 0 ? n + 1 : false 
        )
      ) 
        : null
      );
      //setIsFetching(false);
      setIsFetchingNext(response.ok ? true : null);

      // make the function return false for the await promise
      return false;
    };

    if (canFetchFirst) {
      setIsFetchingFirst(true);
      (async () => {
        setShowLoader(true);
        setCanFetchFirst(false);
        setIsFetchingNext(false);
        const fetchNewStatus = await fetchNewData();
        setShowLoader(fetchNewStatus);
        setIsFetchingFirst(fetchNewStatus);
        setCanFetchFirst(fetchNewStatus);
        fetchNextAbortController.abort();
        console.log('Refetch again:', fetchNewStatus)
      })();

    };

    return () => {
      if (!canFetchFirst) {
        abortController.abort();
       // console.log('New page', signal);
      }
    };

  }, [api, fetchNextAbortController, firstFetch, url, isFetchingFirst, canFetchFirst, searchParams, setSearchParams, columnFilters]);
    
  useEffect(() => {
    const signal = fetchNextAbortController.signal;
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    let fetchPage;

    const fetchNextData = async () => {
      //console.log('Last item:', lastItem.index)
      //console.log('Virtual length:', virtualRows.length)
      if (!lastItem) {
        return false
      } 
      if (lastItem.index >= virtualRows.length -1 &&
        nextPage// !== null
      ) {
        fetchPage = nextPage.shift();
        console.log('Fetch page:', fetchPage);
        if (fetchPage === false) {
          fetchPage = nextPage.shift();
        }
        if (!fetchPage) {
          console.log('No next page to fetch')
          fetchNextAbortController.abort();
          return
        }
        if (isFetchingFirst) {
          console.log('Caught double fetch. Exiting...')
          fetchNextAbortController.abort();
          return
        }

        console.log('Pages:', nextPage)
        searchParams.set('page', fetchPage);
        console.log('Retrieving next page...', fetchPage)
        const response = await api.get(
          url,
          searchParams, 
          {signal: fetchNextAbortController.signal},
      );
        if (isFetchingFirst) {
          console.log('Caught double fetch after request. Exiting...');
          fetchNextAbortController.abort();
          return
        } else {
        
          setData(response.ok && isFetchingNext ? prevData => ([...prevData, ...response.body.data]) : null);
          setMeta(response.ok && isFetchingNext ? response.body._meta : null);
          setLinks(response.ok && isFetchingNext ? response.body._links : null)
          //setShowLoader(response.ok && false);
          if (response.ok) {
            fetchNextAbortController.abort();
          }
          if (response.body._meta.page < response.body._meta.total_pages) {
            console.log("There's another page")
            console.log("Total:", response.body._meta.total_pages);
            return true
          } else {
            console.log('There are no more pages')
            return false
          }
        }
      }
    };
    if (!isFetchingFirst && isFetchingNext) {
      setIsFetchingNext(false);
      (async () => {
        setShowLoader(true)
        const fetchNextStatus = await fetchNextData();
        setIsFetchingNext(fetchNextStatus);
        setShowLoader(false)
        console.log('Fetch next page:', fetchNextStatus)
      })();
    };
    if (isFetchingFirst) {
      fetchNextAbortController.abort();
    }
    return () => {
      if (isFetchingFirst) {
      fetchNextAbortController.abort();
      }
    }
  }, [
    nextPage,
    fetchNextAbortController,
    rowVirtualizer.getVirtualItems(),
    searchParams,
    isFetchingNext,
    links,
    isFetchingFirst,
    totalItemsCount,
    api,
    virtualRows.length,
  ])

  return (
    <>
      <TableToolBar 
        tableInstance={tableInstance} 
        setShowFilters={setShowFilters} 
        showFilters={showFilters}
        setShowColumnTools={setShowColumnTools}
        showColumnTools={showColumnTools}
        rowSelection={rowSelection}
      />
      <div 
        className='DataTableContainer'
        ref={tableContainerRef} 
        style={{
          height: `calc(100vh - 225px)`, // You need to have a parent height or it will try to render all the rows.
          width: "100%",
          overflow: "scroll",
          margin: '5px'
        }}>
        <Table 
          size='sm' 
          striped 
          bordered 
          hover 
          className='DataTable' 
          style={{
            width: tableInstance.getCenterTotalSize(),
          }}
        >
          <TableHeader 
            tableInstance={tableInstance} 
            showFilters={showFilters} 
            showColumnTools={showColumnTools}
          />
           {/*Cut here for table body component*/}
          <tbody 
            style={{
              height: `${totalSize}px`,
              //width: "100%",
              position: "relative"
            }}
          >
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {rows && virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index];
              if (!row) {
                return null;
              } 
              return (
                <tr key={row.id} style={{height: "41px"}}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td 
                        key={cell.id} 
                        style={{
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
          {/*End table body component*/}
          {/*Insert table footer here*/}
        </Table>
      </div>
      {showLoader && <Loader />}
    </>
  );
}

export default DataTable;
