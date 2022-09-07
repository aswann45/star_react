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

  useEffect(() => {
    setPageArray([]);
    setNextPageToFetch(1);
    setLastPage(null);
    setTotalPages(null);
    //console.log('resetting...')
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

  // set Next Page to Fetch
  useEffect(() => {
    //console.log('Setting fetch page...')
    let fetchPage;
    if (hasNextPage) {
      fetchPage = pageArray.shift();
      if (fetchPage <= lastPage) {
        fetchPage = pageArray.shift();
      }
    } else {
      fetchPage = null;
    };
    //console.log('Fetch page:', fetchPage);
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
      const fetchCmd = fetchPage();
      if (fetchCmd) {
        setIsFetchingNewQuery(false);
      };
    };
  }, [isFetchingNewQuery]);

  // Set up the array of pages to get
  useEffect(() => {
    setPageArray(
      Array.from(
        Array(totalPages).keys(), 
        (n) => n !== 0 ? n + 1 : 1 //false 
      )
    );
  }, [totalPages])
  
  const updateData = (row, columnID, value) => {
    //console.log('updating data')

    const newPagesArray = (prevData) => prevData?.pages?.map(page => {
      page.map(obj => {
        if (obj.ID === row.id) {
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

    setData(prevData => ({
      pages: newPagesArray(prevData),
      pageParams: [...prevData.pageParams]
    }));

  };

  const fetchPage = async () => {
    if (searchParams.get('page') === null) {
      return
    }
    //console.log('trying to fetch a page')
    setIsFetching(true);
    const pageAlreadyFetched = value => data.pageParams.some(
      param => param.page === value)
    if (pageAlreadyFetched(Number(searchParams.get('page')))) {
      setIsFetching(false);
      return 
    } else if (lastPage && lastPage >= nextPageToFetch) {
      setIsFetching(false);
      return 
    }

    const checkArrayHasItem = (array, item) => {
      return array.some((arrayVal) => item.ID === arrayVal.ID);
    }


    const updateCheckedPages = (prevData, newPage) => {
      const updatedPages = prevData?.pages?.map(page => {
      //page.filter(object1 => {
        //console.log(!checkArrayHasItem(newPage, object1));
        //console.log(object1)
        page.filter((obj) => !checkArrayHasItem(newPage, obj));
        console.log(page.filter((obj) => !checkArrayHasItem(newPage, obj)));
      //})
      //page.filter(object1 => {
        //return newPage.some(object2 => {
        //return !checkArrayHasItem(newPage, object1)
        //return newPage.some(object2 => object2.ID === object1.ID);
          //return object1.ID === object2.ID
        //});
      //});
      //matches?.map(match => {
        //const idx = page.findIndex(item => item.ID === match.ID);
        //page.splice(page.indexOf(match), 1);
        //return match;
      //});

      return page;
      });

      return [...updatedPages, newPage]
    };
    

    const response = await api.get(
      baseURL,
      searchParams,
      {signal: abortController.signal}
    );
    //console.log('fetching some page...')
    if (response.ok) {
      //console.log(response)
      setData(prevData => ({
        //pages: [...updateCheckedPages(prevData, response.body.data), response.body.data],
        pages: [...updateCheckedPages(prevData, response.body.data)],
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
      console.log('Things are not ok!!!', response)
      setError(response.body.error);
      setIsFetching(false);
    }
    return response.ok;
  };
  
  const fetchNextPage = () => {
    if (isFetching) {
      return
    }
    if (isFetchingNextPage) {
      return
    }
    if (hasNextPage) {
      //console.log('fetching next page...')
      setIsFetchingNextPage(true);
    }
  };

  const fetchNewQuery = () => {
    //console.log('running fetchNewQuery...')
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
    //console.log('Called refresh data')
    setData(prevData => ({
      pages: [],
      pageParams: [...prevData.pageParams],
    }));
    //setLastPage(null);
    //setTotalPages(null);
    setTotalItems(null);
        //console.log('pageParams:', data.pageParams)
    for (const param of data.pageParams) {
      async function refresh(param) {
        setIsFetching(true);
        setIsFetchingPreviousPage(true);
        //console.log('Refresh Params:', param)
        const response = await api.get(
          baseURL,
          param,
          {signal: abortController.signal},
        );
        if (response.ok) {
          //console.log('Refresh response:', response)
          setData(prevData => ({
            pages: [...prevData.pages, response.body.data],
            pageParams: [...prevData.pageParams],
          }));
          //setLastPage(response.body._meta.page);
          setTotalItems(response.body._meta.total_items);
          if (response.body._meta.total_pages !== totalPages) {
            setTotalPages(response.body._meta.total_pages);
          };

          //console.log('Index check:', pageArray.indexOf(response.body._meta.page))
          if (pageArray.indexOf(response.body._meta.page) > -1) {
            //console.log('Removing page:', response.body._meta.page)
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
    updateData,
  ];
};

export default useInfiniteQuery;
