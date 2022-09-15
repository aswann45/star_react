import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useLocation, useOutletContext } from 'react-router-dom';

import RequestListItem from './RequestListItem';
import Loader from './loaders/Loader';
import PaginationBar from './navigation/PaginationBar';
import DetailSubHeader from './DetailSubHeader';

function RequestList({ showMember, title }) {
  const [requests, setRequests] = useState();
  const [pageMeta, setPageMeta] = useState();
  const [pageLinks, setPageLinks] = useState();
  const api = useApi();
  const location = useLocation();
  const [endpoint] = useOutletContext();
  const url = location.pathname;
  const search = location.search;

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
      <DetailSubHeader title={title} />
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
