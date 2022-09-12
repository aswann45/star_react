import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useSearchParams } from 'react-router-dom';

const useInfiniteQuery = (baseURL, firstPageIndex, options) => {
  // api context and search parameter state
  const api = useApi();
  const [searchParams, setSearchParams] = useSearchParams();
  // table data state (paginated)
  const [data, setData] = useState({pages: [], pageParams: []});
  const [error, setError] = useState();
  // request metadata state
  const [lastPage, setLastPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [hasNextPage, setHasNextPage] = useState();
  const [pageArray, setPageArray] = useState([]);
  const [nextPageToFetch, setNextPageToFetch] = useState(firstPageIndex);
  const [limit, setLimit] = useState(null);
  const [filters, setFilters] = useState([]);
  const [order, setOrder] = useState([]);
  const [totalItems, setTotalItems] = useState(null);
  // fetching states
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isFetchingPreviousPage, setIsFetchingPreviousPage] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState();
  const [isFetchingNewQuery, setIsFetchingNewQuery] = useState();
  const [rowIsLoading, setRowIsLoading] = useState({})

  // abort controller for non-refresh fetching
  const abortController = new AbortController();
  // abort controller for refresh fetches
  const refreshAbortController = new AbortController();
  
  // construct search parameters from metadata states
  useEffect(() => {
    setSearchParams({
      limit: limit ?? 25,
      page: !isFetchingNewQuery ? nextPageToFetch ?? 1 : 1,
      filters: JSON.stringify(filters ?? []),
      order: JSON.stringify(order ?? []),
      ...options.searchParams ?? null,
    });
  }, [
    limit, 
    nextPageToFetch, 
    filters, 
    order, 
    options.searchParams, 
    setSearchParams,
    isFetchingNewQuery,
  ]);

  // reset the data and metadata state
  useEffect(() => {
    setPageArray([]);
    setNextPageToFetch(1);
    setLastPage(null);
    setTotalPages(null);
    setData({pages: [], pageParams: []});
  }, [
    //filters, 
    order
  ])
  
// check if query has another page
  useEffect(() => {
    if (totalPages && lastPage === totalPages) {
      setHasNextPage(false)
    }
    else if (pageArray.length > 0) {
      setHasNextPage(true);
    } else {
      setHasNextPage(false);
    }
  },[pageArray, lastPage, totalPages])

// check if the query is for the first page
  useEffect(() => {
    if (!lastPage && firstPageIndex) {
      setIsFirstPage(true);
    } else {
      setIsFirstPage(false);
    }
  }, [firstPageIndex, lastPage])

  // set Next Page to Fetch
  useEffect(() => {
    let fetchPage;
    if (hasNextPage) {
      fetchPage = pageArray.shift();
      if (fetchPage <= lastPage) {
        fetchPage = pageArray.shift();
      }
    } else {
      fetchPage = null;
    };
    setNextPageToFetch(fetchPage);
  }, [hasNextPage, pageArray, lastPage])
  
  // effect to fetch Next Page
  useEffect(() => {
    if (isFetchingNextPage) {
      if (Number(searchParams.get('page')) > nextPageToFetch) {
        return
      } else if (lastPage >= nextPageToFetch) {
        return
      }
      const fetchCmd = fetchPage()
      if (fetchCmd) {
        setIsFetchingNextPage(false);
      };
    };
  }, [isFetchingNextPage, nextPageToFetch, searchParams])

  // effect to fetch new query
  useEffect(() => {
    if (isFetchingNewQuery) {
      const fetchCmd = fetchPage();
      if (fetchCmd) {
        setIsFetchingNewQuery(false);
      };
    };
  }, [isFetchingNewQuery]);

  // Set up an array of pages to avoid duplicate gets
  useEffect(() => {
    setPageArray(
      Array.from(
        Array(totalPages).keys(), 
        (n) => n !== 0 ? n + 1 : 1 
      )
    );
  }, [totalPages])
  
  // update data state and make put request to api
  const updateData = async (row, columnID, value) => {
    // wait half a second 
    await new Promise(r => setTimeout(r, 500));
    // get a shallow copy of the current array of pages with the
    // updated object
    const newPagesArray = (prevData) => prevData?.pages?.map(page => {
      page.map(obj => {
        if (obj.ID === row.id) {
          // if the row ID matches the object ID, update the value
          // and make the put request
          obj[columnID] = value;
          (async () => {
            const objURL = `${baseURL}/${obj.ID}`
            const response = await api.put(objURL, '', {
              body: {
                [columnID]: value,
              }
            })
            if (!response.ok) {
              console.log('There is a problem!!!', response)
            };
          })()
        };
        return obj;
      });
      return page;
    });
    
    // update the data state with the new array
    setData(prevData => ({
      pages: newPagesArray(prevData),
      pageParams: [...prevData.pageParams]
    }));   
  };
  
  // lazily load child records from the api
  const fetchChildRecords = async (row) => {
    // set loading state (will render loading spinner)
    setRowIsLoading(prevRows => ({...prevRows, [row.id]: true}));
    // get the endpoint from the row's metadata
    const childRequestsURL = row?.original?._links?.child_requests || null;
    // make the request and return the promise
    const childRequests = async (row) => {
      if (childRequestsURL === null) {
        return null
      } else {
        const response = await api.get(childRequestsURL, 'limit=100')
        if (response.ok) {
          return response.body;
        } else {
          console.log('Problem!', response)
          return null
        } 
      }
    }
    // get a shallow copy of the pages array with the new children added
    // iterate through all objects in all pages
    const newPagesArray = (prevData, childRequestsArray) => prevData?.pages?.map(page => {
      page.map(obj => {
        if (obj.ID === row.id) {
          // add the array of children to the parent object 
          obj.subRows = childRequestsArray; 
          return obj
        } else {
          // just return the object if there are no children to add
          return obj;
        }
      });
      return page;
    });
    
    
    // get the promise with the children array
    const newChildren = await childRequests(row);
    // set the data state 
    setData(prevData => ({
      pages: newPagesArray(prevData, newChildren.data),
      pageParams: [...prevData.pageParams]
    }));
    // set metadata to allow for virtual row expansion
    setTotalItems(totalItems + newChildren._meta.total_items)
    // reset the row loading state
    setRowIsLoading(prevRows => ({...prevRows, [row.id]: false}));
  }
  
  
  // fetch a page from the API  
  const fetchPage = async () => {
    if (searchParams.get('page') === null) {
      // drop out if we don't have a page to fetch
      return
    }
    // set the fetching state
    setIsFetching(true);
    // check if we've already fetched the page
    const pageAlreadyFetched = value => data.pageParams.some(
      param => param.page === value)
    // compare the search param number to the the params in data state
    if (pageAlreadyFetched(Number(searchParams.get('page')))) {
      setIsFetching(false);
      // if we've already fetched the page, drop out
      return 
    } else if (lastPage && lastPage >= nextPageToFetch) {
      // check if the last page we got is the same as or comes after
      // the next page to fetch; set the fetching state to false and drop out
      setIsFetching(false);
      return 
    }
    // wait for 1 second
    await new Promise(r => setTimeout(r, 1000));
    // get the page
    const response = await api.get(
      baseURL,
      searchParams,
      // attach the fetching abort controller to the request
      {signal: abortController.signal}
    );
    // set the data state with the request payload and metadata
    if (response.ok) {
      setData(prevData => ({
        pages: [...prevData.pages, response.body.data],
        pageParams: [...prevData.pageParams, {
          limit: response.body._meta.limit,
          page: response.body._meta.page,
          filters: searchParams.get('filters'),
          order: searchParams.get('order'),
        }],
      }));
      // set state for the last page we got to this page
      setLastPage(response.body._meta.page);
      // if it's a new query only, set the total number of pages we can expect
      if (isFetchingNewQuery) {
        setTotalPages(response.body._meta.total_pages);
      }
      // set state for total number of items (for virtual row rendering)
      setTotalItems(response.body._meta.total_items);
      // set fetching state to false
      setIsFetching(false);
    } else {
      // log the error to the console for now
      // TODO: make errors available to the UI
      console.log('Things are not ok!!!', response)
      setError(response.body.error);
      // set the fetching state to false
      setIsFetching(false);
    }
    // return the api response status
    return response.ok;
  };
  
  // function to set fetching status state to 
  // fetch the next page in a query
  const fetchNextPage = () => {
    if (isFetching) {
      // if we're already fetching something, drop out
      return
    }
    if (isFetchingNextPage) {
      // if we've already called this function, drop out
      return
    }
    if (hasNextPage) {
      // if we have another page to fetch, fetch it
      setIsFetchingNextPage(true);
    }
  };
  
  // function to set fetching status state to 
  // fetch the first page for a new query
  const fetchNewQuery = () => {
    if (isFetching) {
      abortController.abort();
      console.log('Aborted!')
      return
    }
    if (nextPageToFetch !== null && nextPageToFetch !== 1) {
      return
    } else {
      setData({pages: [], pageParams: []});
      setLastPage();
      setNextPageToFetch(1);
      setIsFetchingNewQuery(true);
    }
  };
    
  // force refresh all data pages
  /*const refreshData = () => {
    setData(prevData => ({
      pages: [],
      pageParams: [...prevData.pageParams],
    }));
    setTotalItems(null);

    for (const param of data.pageParams) {
      async function refresh(param) {
        setIsFetching(true);
        setIsFetchingPreviousPage(true);
        const response = await api.get(
          baseURL,
          param,
          {signal: abortController.signal},
        );
        if (response.ok) {
          setData(prevData => ({
            pages: [...prevData.pages, response.body.data],
            pageParams: [...prevData.pageParams],
          }));
          setTotalItems(response.body._meta.total_items);
          if (response.body._meta.total_pages !== totalPages) {
            setTotalPages(response.body._meta.total_pages);
          };

          if (pageArray.indexOf(response.body._meta.page) > -1) {
            pageArray.splice(pageArray.indexOf(response.body._meta.page), 1);
          }
          setLastPage(lastPage)
          setNextPageToFetch(lastPage + 1);
        }
        setIsFetchingPreviousPage(false);
        setIsFetching(false);
        return true
      }
      refresh(param);
    }
  }*/
  
  // replace a page in data state with a new page
  const splicePrevData = (prevData, newPage) => {
    const removed = prevData?.pages?.splice(
      Number(newPage.body._meta.page - 1), // get the page index from metadata
      1, 
      newPage.body.data
    );    
    return prevData.pages;
  }
  
  // refresh data state by page in pages array
  // loops through page params and makes a get call to the api
  // for each page's parameters
  const backgroundRefreshData = async () => {
    // if fetch state is false, drop out and abort request
    if (!isFetchingPreviousPage) {
      refreshAbortController.abort()
      console.log('Background refresh aborted!')
      return
    } else if (isFetching) {
      // if we're already fetching something else,
      // drop out and abort request
      refreshAbortController.abort()
      console.log('Background refresh aborted!')
      return
    } else {
      // set the fetch state to block other requests
      setIsFetching(true);
      // loop through the data state parameters
      for (const param of data.pageParams) {
        // function to refresh data
        async function refresh() {
          // get request params
          const response = await api.get(
            baseURL,
            param,
            // attach abort controller to request
            {signal: refreshAbortController.signal},
          );
          // set the data state to the updated data pages
          if (response.ok) {
            setData(prevData => ({
              pages: splicePrevData(prevData, response),
              pageParams: [...prevData.pageParams],
            }));
          }
        }
        // call the refresh function for each set of params
        refresh();
      }
    }
  }
  
  // function to set state to refresh data for previous pages
  const refreshData = () => {
    if (isFetching) {
      // drop out if we're already fetching another page
      return
    } else if (isFetchingPreviousPage) {
      // drop out if we've already called this function
      return
    } else {
      // set the fetch state
      setIsFetchingPreviousPage(true);
    }
  };
  
  useEffect(() => {
    if (!isFetchingPreviousPage) {
      // if fetch state is false, drop out
      return
    } else if (isFetching) {
      // if we're already fetching something else, drop out
      return
    } else {
      // run the refresh function
      backgroundRefreshData();        
    }
    return () => {
      // cleanup by setting the fetch state back to false
      setIsFetchingPreviousPage(false)
    }
  }, [isFetchingPreviousPage, isFetching])

  return [
    data, 
    //error, 
    //totalPages, 
    setLimit, 
    setFilters, 
    setOrder,
    totalItems, 
    setTotalItems,
    //isFetchingNextPage,
    //isFetchingPreviousPage,
    isFetching,
    fetchNextPage,
    fetchNewQuery,
    refreshData,
    hasNextPage,
    //isFirstPage,
    //lastPage,
    nextPageToFetch,
    //pageArray,
    updateData,
    //backgroundRefreshData,
    //setIsFetchingPreviousPage,
    fetchChildRecords,
    rowIsLoading,
  ];
};

export default useInfiniteQuery;
