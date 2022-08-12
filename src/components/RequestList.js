import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import RequestListItem from './RequestListItem';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import Loader from './Loader';
import PaginationBar from './PaginationBar';

function RequestList({ showMember }) {
  const [requests, setRequests] = useState();
  const [pageMeta, setPageMeta] = useState();
  const [pageLinks, setPageLinks] = useState();
  const api = useApi();
  const location = useLocation();
  const url = location.pathname;
  const search = location.search;

  console.log(`URL from RequestList ${url}`)
  useEffect(() => {
    (async () => {
      const response = await api.get(url, search);
      setRequests(response.ok ? response.body.data : null);
      setPageMeta(response.ok ? response.body['_meta'] : null);
      setPageLinks(response.ok ? response.body['_links'] : null);
    })();
  }, [api, url, search]);

  return (
    <>
      {(requests && requests.length !== 0) ?
        <>
          {(pageMeta && pageLinks) &&
          <PaginationBar url={url} pageMeta={pageMeta} pageLinks={pageLinks} />
          }
          {
          requests.map(request => <RequestListItem key={request.ID} request={request} showMember={showMember}/>)
          }
          {(pageMeta && pageLinks) &&
          <PaginationBar url={url} pageMeta={pageMeta} pageLinks={pageLinks} />
          }
          </>
       : 
          <Loader obj={requests} />
      }
    </>
  );
}

export default RequestList;
