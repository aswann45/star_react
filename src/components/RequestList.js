import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useLocation, useOutletContext } from 'react-router-dom';

import RequestListItem from './RequestListItem';
import Loader from './loaders/Loader';
import PaginationBar from './navigation/PaginationBar';
import DetailSubHeader from './DetailSubHeader';

function RequestList({ showMember, title, endpoint_suffix, isChild }) {
  const [requests, setRequests] = useState();
  const [pageMeta, setPageMeta] = useState();
  const [pageLinks, setPageLinks] = useState();
  const api = useApi();
  const location = useLocation();
  const [request_url, request_id] = useOutletContext();
  const url = request_url + endpoint_suffix;
  const search = location.search;
  
  const handleUnlinkClick = async (request) => {
    const response = await api.post(
      `${request_url}/remove_child`, '', {
        body: {
          'child_id': request.ID
        }
      }
    )
    if (!response.ok) {
      console.log('Not ok!')
    }
    const newRequestsArray = requests.filter((item) => item.ID !== request.ID)
    setRequests(newRequestsArray)
  }

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
          <PaginationBar 
            url={url} 
            pageMeta={pageMeta} 
            pageLinks={pageLinks} 
            keepBackground={true} />
          }
          {
            requests.map(
              request => <RequestListItem 
                key={request.ID} 
                request={request} 
                showMember={showMember} 
                isChild={isChild} 
                handleUnlinkClick={handleUnlinkClick} />
            )
          }
          {(pageMeta && pageLinks) &&
            <PaginationBar 
              url={url} 
              pageMeta={pageMeta} 
              pageLinks={pageLinks} 
              keepBackground={true} />
          }
          </>
       : 
          <Loader obj={requests} />
      }
    </>
  );
}

export default RequestList;
