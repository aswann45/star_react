import { useState, useEffect, useRef } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useLocation, useSearchParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { 
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  useReactTable,
} from '@tanstack/react-table';
import Loader from './Loader';
import { useVirtualizer } from '@tanstack/react-virtual';
import MemberRequestsColumns from './table_columns/MemberRequestsColumns';
import TableHeader from './TableHeader';
import ColumnVisibilityToggle from './ColumnVisibilityToggle';

// imported columns for Member Requests
const columns = MemberRequestsColumns;

function DataTable() {
  // URL and API request logic and state
  const [searchParams, setSearchParams] = useSearchParams();
  const api = useApi();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState();
  const [firstFetch, setFirstFetch] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [nextPage, setNextPage] = useState();
  const [links, setLinks] = useState();
  const url = '/member_requests/';

  // Column visibility, pinning, and order state
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnPinning, setColumnPinning] = useState({});
  const [columnOrder, setColumnOrder] = useState(
    columns.map(column => column.accessorKey)
  );
  
  // column filters
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    console.log('running the column filters effect')
    setIsFetchingNext(false);
    setIsFetching(true);
    setNextPage();
    setSearchParams({
      limit: 100,
      filters: JSON.stringify(columnFilters ?? []),
      page: 1,
    });
  }, [
      columnFilters, 
      setSearchParams, 
    ]
  );
    
  // Table instance
  const tableInstance = useReactTable({ 
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
      columnFilters,
      globalFilter,
    },
    manualFiltering: true,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(), 
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
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
    ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
    : 0

/*
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    const fetchFirstData = async () => {
      console.log('Loading first page...')
       
      const response = await api.get(
        url,
        '?limit=100&filters=[]&page=1',
        {signal: signal}
      );

      setData(response.ok ? response.body.data : null);
      setMeta(response.ok ? response.body._meta : null);
      setLinks(response.ok ? response.body._links : null);
      setIsFetching(false);
      setIsLoading(response.ok && false);
      setNextPage(response.ok ? (1 + response.body._meta.page) : null);
      setIsFetchingNext(response.ok ? true : null);
      // make the function return false for the await promise
      return false;
    };
    if (!data.length && isLoading === true) {
      (async () => {
        const fetchFirstStatus = await fetchFirstData();
        console.log('Load again:', fetchFirstStatus)
      })();

    };
    if (!isLoading) {
      return () => {
        abortController.abort();
        //console.log('First Page', signal);
      };
    };
  }, [api, url, data.length, isLoading, searchParams, setSearchParams])
  */
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchNewData = async () => {
      if (firstFetch) {
        setFirstFetch(false);
        return
      }
      if (!searchParams.get('filters')) {
        return
      };
      if (searchParams.get('page') > 1) {
        return
      }

      console.log('Refetching new set...');      
      setData([]);
      setLinks();
      setMeta();
      setNextPage(null);

      const response = await api.get(
        url,
        searchParams,
        {signal: signal}
      );

      if (response.ok) {
          abortController.abort();
      }
      setData(response.ok ? response.body.data : null);
      setMeta(response.ok ? response.body._meta : null);
      setLinks(response.ok ? response.body._links : null);
      setNextPage(response.ok ? (1 + response.body._meta.page) : null);
      setIsFetching(false);
      setIsFetchingNext(response.ok ? true : null);

      // make the function return false for the await promise
      return false;
    };

    if (isFetching) {
      (async () => {
        setIsFetching(false);
        const fetchNewStatus = await fetchNewData();
        setIsFetching(fetchNewStatus);
        console.log('Refetch again:', fetchNewStatus)
      })();

    };

    return () => {
      if (!isFetching) {
        abortController.abort();
       // console.log('New page', signal);
      }
    };

  }, [api, url, isFetching, searchParams, setSearchParams, columnFilters]);
  
  useEffect(() => {
    //
    //
    //TODO: figure out a way to get each unique page and no duplicate pages.
    // Maybe something like iterating over an array of the page numbers? 
    //
    // TODO: Also, need to figure out how to render the loader when querying
    // the database.
    //
    //
    const abortController = new AbortController();
    const signal = abortController.signal;
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    const fetchNextData = async () => {
      if (!lastItem) {
        return false
      } 
      if (lastItem.index >= virtualRows.length -1 &&
        nextPage !== null
      ) {
        searchParams.set('page', nextPage);
        console.log('Retrieving next page...', nextPage)
        const response = await api.get(
          url,
          searchParams, 
          {signal: signal},
      );
        setData(response.ok ? prevData => ([...prevData, ...response.body.data]) : null);
        setMeta(response.ok ? response.body._meta : null);
        setLinks(response.ok ? response.body._links : null)
        setNextPage(response.ok ? (response.body._meta.page + 1) : null);
        if (response.ok) {
          abortController.abort();
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
    };
    if (!isFetching && isFetchingNext) {
      setIsFetchingNext(false);
      (async () => {
        const fetchNextStatus = await fetchNextData();
        setIsFetchingNext(fetchNextStatus);
        console.log('Fetch next:', fetchNextStatus)
      })();
    };
    return () => {
      if (!isFetchingNext || isFetching) {
      abortController.abort();
       // console.log('Next Page', signal);
      }
    }
  }, [
    nextPage,
    rowVirtualizer.getVirtualItems(),
    searchParams,
    isFetchingNext,
    links,
    isFetching,
    totalItemsCount,
    api,
    virtualRows.length,
  ])
  
  
  return (
    <>
      <ColumnVisibilityToggle tableInstance={tableInstance} />
            {/*Filter Select Tests
      <FilterSelect data={data} />
      End Filter Select Tests*/}
      <div ref={tableContainerRef} 
        style={{
          height: `calc(100vh - 225px)`, // You need to have a parent height or it will try to render all the cards.
          width: "100%",
          overflow: "scroll"
        }}>
        <Table size='sm' striped bordered hover>
          <TableHeader tableInstance={tableInstance} />
           {/*Cut here for table body component*/}
          <tbody 
            style={{
              height: `${totalSize}px`,
              width: "100%",
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
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
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
      {(isFetching || firstFetch) && <Loader />}
    </>
  );
}

export default DataTable;
