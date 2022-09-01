import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useSearchParams } from 'react-router-dom';

const useInfiniteQuery = (baseURL, firstPageIndex, options) => {
  const api = useApi();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState({pages: [], pageParams: []});
  const [error, setError] = useState();

  const [lastPage, setLastPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [hasNextPage, setHasNextPage] = useState();
  const [pageArray, setPageArray] = useState([]);
  const [nextPageToFetch, setNextPageToFetch] = useState(firstPageIndex);
  const [limit, setLimit] = useState(null);
  const [filters, setFilters] = useState([]);
  const [order, setOrder] = useState([]);
  const [totalItems, setTotalItems] = useState(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isFetchingPreviousPage, setIsFetchingPreviousPage] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState();
  const [isFetchingNewQuery, setIsFetchingNewQuery] = useState();


  const abortController = new AbortController();
    
  useEffect(() => {
    setSearchParams({
      limit: limit ?? 25,
      page: !isFetchingNewQuery ? nextPageToFetch : 1,
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

  useEffect(() => {
    setPageArray([]);
    setNextPageToFetch(1);
    setLastPage(null);
    setTotalPages(null);
    console.log('resetting...')
    setData({pages: [], pageParams: []});
  }, [filters, order])
  
// set Has Next Page bool
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

// set Is First Page bool
  useEffect(() => {
    if (!lastPage && firstPageIndex) {
      setIsFirstPage(true);
    } else {
      setIsFirstPage(false);
    }
  }, [firstPageIndex, lastPage])

  //* set Next Page to Fetch
  useEffect(() => {
    let fetchPage;
    if (hasNextPage) {
      fetchPage = pageArray.shift();
      console.log('Fetch page:', fetchPage);
      if (fetchPage === lastPage) {
        fetchPage = pageArray.shift();
      }
    } else {
      fetchPage = null;
    };
    setNextPageToFetch(fetchPage);
  }, [hasNextPage, pageArray, lastPage])
  
  // fetch Next Page
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

  // fetch new query
  useEffect(() => {
    if (isFetchingNewQuery) {
      //resetForNewQuery();
      const fetchCmd = fetchPage();
      if (fetchCmd) {
        setIsFetchingNewQuery(false);
        
      };
    };
  }, [isFetchingNewQuery]);

  useEffect(() => {
    setPageArray(
      Array.from(
        Array(totalPages).keys(), 
        (n) => n !== 0 ? n + 1 : 1 //false 
      )
    );
  }, [totalPages])

  const fetchPage = async () => {
    console.log('trying to fetch a page')
    setIsFetching(true);
    const pageAlreadyFetched = value => data.pageParams.some(
      param => param.page === value)
    if (pageAlreadyFetched(Number(searchParams.get('page')))) {
      setIsFetching(false);
      return
    } else if (lastPage && lastPage >= nextPageToFetch) {
      setIsFetching(false);
      return
    }// else if (typeof nextPageToFetch === 'undefined') {
     // return
    //}

    const response = await api.get(
      baseURL,
      searchParams,
      {signal: abortController.signal}
    );
    console.log('fetching some page...')
    if (response.ok) {
      console.log(response)
      setData(prevData => ({
        pages: [...prevData.pages, response.body.data],
        pageParams: [...prevData.pageParams, {
          limit: response.body._meta.limit,
          page: response.body._meta.page,
          filters: searchParams.get('filters'),
          order: searchParams.get('order'),
        }],
      }));
      setLastPage(response.body._meta.page);
      if (isFetchingNewQuery) {
        setTotalPages(response.body._meta.total_pages);
      }
      setTotalItems(response.body._meta.total_items);
      setIsFetching(false);
    } else {
      console.log(response)
      setError(response.body.error);
      setIsFetching(false);
    }
    return response.ok;
  };
  
  const fetchNextPage = () => {
    if (isFetching) {
      //abortController.abort();
      //console.log('Aborted!')
      return
    }
    if (isFetchingNextPage) {
      //abortController.abort();
      //console.log('Aborted!')
      return
    }
    if (hasNextPage) {
      console.log('fetching next page...')
      setIsFetchingNextPage(true);
    }
  };

  const resetForNewQuery = () => {
    console.log('resetting...')
    setData({pages: [], pageParams: []});
    setLastPage(0);
    setNextPageToFetch(1);
    //setSearchParams(prevParams => ({
     // ...prevParams,
     // page: 1,
  //}))

    return true
  }

  const fetchNewQuery = () => {
    console.log('running fetchNewQuery...')
    if (isFetching) {
      abortController.abort();
      console.log('Aborted!')
      return
    }
    if (nextPageToFetch !== null && nextPageToFetch !== 1) {
      return
    } else {
      setIsFetchingNewQuery(true);
    }
  };

  const refreshData = () => {
    setData(prevData => ({
      pages: [],
      pageParams: [...prevData.pageParams],
      ...prevData
    }));
    setLastPage(null);
    setTotalPages(null);
    setTotalItems(null);
    const refreshData = async (param) => {
      const response = await api.get(
        baseURL,
        param,
        {signal: abortController.signal},
      );
      if (response.ok) {
        setData(prevData => ({
          pages: [...prevData.pages, response.body.data],
          ...prevData
        }));
        setLastPage(response.body._meta.page);
        setTotalPages(response.body._meta.total_pages);
        setTotalItems(response.body._meta.total_items);
      }
      return response.ok
    }
    for (const param in data.pageParams) {
      setIsFetchingPreviousPage(true);
      const refresh = refreshData(param);
      if (refresh === true) {
        setIsFetchingPreviousPage(false);
      }
    }
  }

  return [
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
  ];
};

export default useInfiniteQuery;
