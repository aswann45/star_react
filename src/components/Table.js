import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useLocation } from 'react-router-dom';
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
import useInfiniteQuery from '../hooks/useInfiniteQuery';

// imported columns for Member Requests
const columns = MemberRequestsColumns;


function DataTable() {
  // URL and API request logic and state
  //const [searchParams] = useSearchParams();

  const location = useLocation();
  const search = location.search;
  const url = '/member_requests/';
  const [
    data,
    error,
    totalPages, 
    setLimit, 
    setFilters, 
    setOrder,
    totalItems, 
    isFetchingNextPage,
    isFetchingPreviousPage,
    isFetching,
    fetchNextPage,
    fetchNewQuery,
    refreshData,
    hasNextPage,
    isFirstPage,
    lastPage,
    nextPageToFetch,
    pageArray,
  ] = useInfiniteQuery(url, 1, '');

  /*useEffect(() => {
    if (isFetching) {
      fetchNewQuery();  
    }
  }, [isFetching, fetchNewQuery])*/

  const api = useApi();
 /* const [data, setData] = useState([]);
  const [meta, setMeta] = useState();
  const [firstFetch, setFirstFetch] = useState(true);
  const [canFetchFirst, setCanFetchFirst] = useState(true);
  const [isFetchingFirst, setIsFetchingFirst] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [nextPage, setNextPage] = useState();
  const [showLoader, setShowLoader] = useState(true);
  const [links, setLinks] = useState();*/
  //const fetchNextAbortController = new AbortController();
  
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


  /*useEffect(() => {
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
  );*/

  useEffect(() => {
    setFilters(columnFilters);
  }, [columnFilters, setFilters])

  useEffect(() => {
    setLimit(50);
  })
  
  /*
  useEffect(() => {
    fetchNextAbortController.abort();
    console.log('Resetting fetch states')
    setIsFetchingNext(false);
    setCanFetchFirst(true);
    setNextPage();
  }, [searchParams])
  */

  // sorting
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    setOrder(sorting);
  }, [sorting, setOrder]);


  // row selection
  const [rowSelection, setRowSelection] = useState({});
  const getRowId = (originalRow, relativeIndex, parent) => {
    //if (originalRow) {
      return parent ? [parent.ID, originalRow.ID].join('.') : originalRow.ID;
    //} else {
     // return
   // };
  };

  //sub rows
  const [expanded, setExpanded] = useState({});
  const getSubRowsFx = (originalRow, index) => {
    return originalRow.children.length > 0 && originalRow.children;
  }

  const flatData = useMemo(
    () => data?.pages?.flatMap(page => page) ?? [],
    [data]
  )
  //console.log('Data:', data)
    //console.log('Flat Data:', flatData)

  // Table instance
  //
  const tableInstance = useReactTable({ 
    data: flatData,
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
    manualSorting: true,
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
  //const totalItemsCount = meta && meta.total_items;
  const tableContainerRef = useRef();
  const { rows } = tableInstance.getRowModel();
  const rowVirtualizer = useVirtualizer({
    //count: totalItemsCount && totalItemsCount,
    count: totalItems && totalItems,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => rows.length,
    overscan: 15,
  });

  const totalVirtualSize = rowVirtualizer.getTotalSize();
  const virtualRows = rowVirtualizer.getVirtualItems();
  //console.log('Virtual rows length:', virtualRows.length -1) 

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom = 
    virtualRows.length > 0
    ? totalVirtualSize - (virtualRows?.[virtualRows.length - 1]?.end)
    : 0

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
    if (containerRefElement) {
      const { scrollHeight, scrollTop, clientHeight } = containerRefElement
      //console.log('scrollHeight', scrollHeight)
      //console.log('scrollTop', scrollTop)
      //console.log('clientHeight', clientHeight)
      console.log('Calc Height:', (scrollHeight - scrollTop - clientHeight - paddingBottom))
      if (
        scrollHeight - scrollTop - clientHeight - paddingBottom < 1000 &&
        //clientHeight - scrollTop < 100 &&
        !isFetching &&
        hasNextPage &&
        flatData.length > 0
      ) {
        fetchNextPage()
      }
    }
  }, [fetchNextPage, isFetching, hasNextPage, flatData.length, paddingBottom]
);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  useEffect(() => {
    if (flatData.length === 0) {
      rowVirtualizer.scrollToOffset(0)
    }
  }, [flatData.length])
/*
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
    */
 
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    const virtualLength = virtualRows.length;


  return (
    <>
      {/*<pre>Data: {JSON.stringify(data)}</pre>*/}
      <pre>totalItems: {JSON.stringify(totalItems)}</pre>
      <pre>totalPages: {JSON.stringify(totalPages)}</pre>
      <pre>hasNextPage: {JSON.stringify(hasNextPage)}</pre>
      <pre>lastPage: {JSON.stringify(lastPage)}</pre>
      <pre>nextPageToFetch: {JSON.stringify(nextPageToFetch)}</pre>
      <pre>isFirstPage: {JSON.stringify(isFirstPage)}</pre>
      <pre>isFetching: {JSON.stringify(isFetching)}</pre>
      <pre>isFetchingNextPage: {JSON.stringify(isFetchingNextPage)}</pre>
      <pre>isFetchingPreviousPage: {JSON.stringify(isFetchingPreviousPage)}</pre>
      <pre>totalVirtualSize: {JSON.stringify(totalVirtualSize)}</pre>
      <pre>paddingTop: {JSON.stringify(paddingTop)}</pre>
      <pre>paddingBottom: {JSON.stringify(paddingBottom)}</pre>
      <pre>lastItem: {JSON.stringify(lastItem && lastItem.index)}</pre>
      <pre>virtualLength - 1: {JSON.stringify(virtualLength - 1)}</pre>
      <pre>data.pageParams: {JSON.stringify(data.pageParams)}</pre>
      <pre>pageArray: {JSON.stringify(pageArray.length)}</pre>
      <pre>flatData: {JSON.stringify(flatData)}</pre>

      <TableToolBar 
        tableInstance={tableInstance} 
        setShowFilters={setShowFilters} 
        showFilters={showFilters}
        setShowColumnTools={setShowColumnTools}
        showColumnTools={showColumnTools}
        rowSelection={rowSelection}
        fetchNewQuery={fetchNewQuery}
        fetchNextPage={fetchNextPage}
      />
      <div 
        className='DataTableContainer'
        onScroll={e => fetchMoreOnBottomReached(e.target)}
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
              height: `${totalVirtualSize}px`,
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
        {(flatData.length < 1 && !isFetching) && <p>There is no data to display.</p>}
        {isFetching && <Loader />}
      </div>
    </>
  );
}

export default DataTable;
