import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
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
import Loader from '../loaders/Loader';
import { useVirtualizer } from '@tanstack/react-virtual';
import TableHeader from './TableHeader';
import TableToolBar from './TableToolBar';
import useInfiniteQuery from '../../hooks/useInfiniteQuery';
import useLocalStorage from '../../hooks/useLocalStorage';

function DataTable({
  columns,
  url,
  localStorageLocation,
  getURL,
  allowGrouping,
  setIsDetail,
  isDetail
}) {
  // retrieve saved user configuration from local storage
  const [tableSettings, setTableSettings] = useLocalStorage(localStorageLocation, {})

  // URL and API request logic and state
  const [
    data,
    //error,
    //totalPages,
    setLimit,
    setFilters,
    setOrder,
    totalItems,
    setTotalItems,
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
    totalPages,
    updateData,
    //backgroundRefreshData,
    //setIsFetchingPreviousPage,
    fetchChildRecords,
    rowIsLoading,
    groupRequests,
    resetSearch,
    removeProjects,
    exportRows,
  ] = useInfiniteQuery(url, 1, '', getURL);

  // Column visibility, pinning, and order state
  const [columnVisibility, setColumnVisibility] = useState(
    tableSettings.columnVisibility ?? {});
  const [columnPinning, setColumnPinning] = useState(tableSettings.columnPinning || {});
  const [columnOrder, setColumnOrder] = useState(tableSettings.columnOrder ||
    columns.map(column => column.accessorKey || column.id)
  );

  // column toolbar visibilities
  const [showFilters, setShowFilters] = useState(tableSettings.showFilters || true);
  const [showColumnTools, setShowColumnTools] = useState(tableSettings.showColumnTools);

  // column resizing -- using state for now in case we want the user to change
  // how resizing works
  const [columnResizeMode, setColumnResizeMode] = useState('onChange');

  // column filters
  const [columnFilters, setColumnFilters] = useState(tableSettings.columnFilters);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    setFilters(columnFilters);
  }, [columnFilters, setFilters])

  useEffect(() => {
    setLimit(100);
  })

  // sorting
  const [sorting, setSorting] = useState(tableSettings.sorting);
  useEffect(() => {
    setOrder(sorting);
  }, [sorting, setOrder]);

  // row selection
  const [rowSelection, setRowSelection] = useState({});
  const getRowId = (originalRow, relativeIndex, parent) => {
    return originalRow.ID;
  };

  //sub rows
  const [expanded, setExpanded] = useState({});

  // flatten the page arrays recieved from the data.pages array
  const flatData = useMemo(
    () => data?.pages?.flatMap(page => page) ?? [],
    [data]
  )

  // Table instance
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
    meta: {
      updateData: updateData,
      fetchChildRecords: fetchChildRecords,
      rowIsLoading: rowIsLoading,
      setTotalItems: setTotalItems,
      setIsDetail: setIsDetail,
      groupRequests: groupRequests,
      removeProjects: removeProjects,
      exportRows: exportRows,
      exportURLPrefix: getURL ?? url,
    },
    getRowId,
    getSubRows: row => row.subRows,
    manualFiltering: true,
    manualSorting: true,
    autoResetExpanded: false,
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

  const tableWidth = useMemo(() => tableInstance.getCenterTotalSize(), [tableInstance])

  // virtualized rows
  const tableContainerRef = useRef();
  const { rows } = tableInstance.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    //estimateSize: () => rows.length,
    estimateSize: () => 65,
    overscan: 10,
    enableSmoothScroll: true,
    //paddingEnd: 0,
    paddingEnd: 800,
  });
  //console.log(tableContainerRef)

  /*const tableHeight = useMemo(
    () => (
      tableContainerRef?.current?.scrollHeight !== undefined
      ? tableContainerRef?.current?.scrollHeight
      : 0
    ),
    [tableContainerRef?.current?.scrollHeight]
  )*/

  const totalVirtualSize = rowVirtualizer.getTotalSize();
  const virtualRows = rowVirtualizer.getVirtualItems();
  /*const [paddingTop, setPaddingTop] = useState(0)
  const [paddingBottom, setPaddingBottom] = useState(0)

  useEffect(() => {
    setPaddingTop(virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0)
    setPaddingBottom(virtualRows.length > 0
    ? totalVirtualSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
    : 0)
  }, [virtualRows, totalVirtualSize])*/


  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom = virtualRows.length > 0
    ? totalVirtualSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
    : 0
  // fetch more data when we get to the bottom of the loaded rows
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //console.log('scrollHeight', scrollHeight)
        //console.log('scrollTop', scrollTop)
        //console.log('clientHeight', clientHeight)
        //console.log('Calc Height:', (scrollHeight - scrollTop - clientHeight - paddingBottom))

        if (
          //scrollHeight - scrollTop - clientHeight - paddingBottom < 300 &&
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          hasNextPage &&
          flatData.length > 0
        ) {
          // refresh previous pages, then fetch the next page (avoid duplicates)
          refreshData();
          fetchNextPage();
        }
      }
    }, [
      fetchNextPage,
      isFetching,
      hasNextPage,
      flatData.length,
      //paddingBottom,
    ]
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  // scroll to top when we reset the data state
  useEffect(() => {
    if (flatData.length === 0) {
      rowVirtualizer.scrollToOffset(0)
    }
  }, [flatData.length])

  // save user configuration to local storage
  useEffect(() => {
    setTableSettings({
      columnVisibility: columnVisibility,
      columnPinning: columnPinning,
      columnOrder: columnOrder,
      showFilters: showFilters,
      showColumnTools: showColumnTools,
      columnFilters: columnFilters,
      globalFilter: globalFilter,
      sorting: sorting,
    })
  }, [
    columnVisibility,
    columnPinning,
    columnOrder,
    showFilters,
    showColumnTools,
    columnFilters,
    globalFilter,
    sorting,
  ]);

  //const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
  //const virtualLength = virtualRows.length;

  return (
    <Container fluid>


{/*
    <pre>isFetching: {JSON.stringify(isFetching)}</pre>

    <>
      <pre>totalVirtualSize: {JSON.stringify(totalVirtualSize)}</pre>
      <pre>paddingBottom: {JSON.stringify(paddingBottom)}</pre>
      <pre>scrollHeight: {JSON.stringify(tableContainerRef?.current?.scrollHeight)}</pre>
      <pre>clientHeight: {JSON.stringify(tableContainerRef?.current?.clientHeight)}</pre>
      <pre>scrollTop: {JSON.stringify(tableContainerRef?.current?.scrollTop)}</pre>
      <pre>calcHeight: {JSON.stringify(
        tableContainerRef?.current?.scrollHeight -
        tableContainerRef?.current?.clientHeight -
        tableContainerRef?.current?.scrollTop
      )}
      </pre>
      <pre>tableWidth: {JSON.stringify(tableInstance.getCenterTotalSize())}</pre>

    </>

        <pre>isFetchingNextPage: {JSON.stringify(isFetchingNextPage)}</pre>
        <pre>isFetchingPreviousPage: {JSON.stringify(isFetchingPreviousPage)}</pre>
        <pre>hasNextPage: {JSON.stringify(hasNextPage)}</pre>
        <pre>lastPage: {JSON.stringify(lastPage)}</pre>
        <pre>nextPageToFetch: {JSON.stringify(nextPageToFetch)}</pre>
        <pre>isFirstPage: {JSON.stringify(isFirstPage)}</pre>

        <pre>totalItems: {JSON.stringify(totalItems)}</pre>
        <pre>isDetail: {JSON.stringify(isDetail)}</pre>
        <pre>Data: {JSON.stringify(data, null, 2)}</pre>
        <pre>expanded: {JSON.stringify(expanded, null, 2)}</pre>
        <pre>columnVisibility: {JSON.stringify(columnVisibility, null, 2)}</pre>
        <pre>columnFilters: {JSON.stringify(columnFilters, null, 2)}</pre>
        <pre>sorting: {JSON.stringify(sorting, null, 2)}</pre>
        <pre>totalPages: {JSON.stringify(totalPages)}</pre>


        <pre>totalVirtualSize: {JSON.stringify(totalVirtualSize)}</pre>
        <pre>paddingTop: {JSON.stringify(paddingTop)}</pre>

        <pre>lastItem: {JSON.stringify(lastItem && lastItem.index)}</pre>
        <pre>virtualLength - 1: {JSON.stringify(virtualLength - 1)}</pre>
        <pre>data.pageParams: {JSON.stringify(data.pageParams)}</pre>
        <pre>pageArray: {JSON.stringify(pageArray)}</pre>
        <pre>pageArray Length: {JSON.stringify(pageArray.length)}</pre>
        <pre>sorting: {JSON.stringify(sorting)}</pre>
        <pre>tableSettings: {JSON.stringify(tableSettings)}</pre>
      */}

      <TableToolBar
        tableInstance={tableInstance}
        setShowFilters={setShowFilters}
        showFilters={showFilters}
        setShowColumnTools={setShowColumnTools}
        showColumnTools={showColumnTools}
        rowSelection={rowSelection}
        fetchNewQuery={fetchNewQuery}
        isFetching={isFetching}
        nextPageToFetch={nextPageToFetch}
        totalItems={totalItems}
        resetSearch={resetSearch}
        fetchedItems={flatData.length}
        allowGrouping={allowGrouping}
        //backgroundRefreshData={backgroundRefreshData}
      />
        {(flatData.length < 1 && !isFetching) && <p>Please select new filter parameters.</p>}
      <div
        className='DataTableContainer'
        onScroll={e => fetchMoreOnBottomReached(e.target)}
        ref={tableContainerRef}
        style={{
          height: `calc(100vh - 160px)`, // You need to have a parent height or it will try to render all the rows.
          width: "100%",
          overflow: "scroll",
          margin: '5px',
          scrollbarWidth: 'auto',
        }}>
        <Table
          size='sm'
          striped
          bordered
          hover
          className='DataTable'
          style={{
            width: tableInstance.getCenterTotalSize(),
            //width: tableWidth
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
                <td style={{
                  //height: `64px`
                  height: `${paddingTop}px`
                }} />
              </tr>
            )}
            {rows && virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index];
              if (!row) {
                return null;
              }
              return (
                <tr
                  key={row.id}
                  style={{
                    //height: "64px",
                    //position: 'fixed',
                    height: `${virtualRow.size}px`,
                    //transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          //height: '42px'
                          //minHeight: `${virtualRow.size}px`,
                          //transform: `translateY(${virtualRow.start}px)`,
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
        </Table>
      </div>

    </Container>
  );
}

export default memo(DataTable);
