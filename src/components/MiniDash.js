import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiProvider';

function MiniDash() {
  
  const api = useApi();
  let request_url;
  const [data, setData] = useState([]);
  
  const fetchData = useCallback(async () => {
    const response = await api.get(request_url);
    setData(response.ok ? response.body : null);
  }, [request_url])

  useEffect(() => {
    //fetchData();
    console.log('Minidash api call')
  }, [fetchData])

  return (
    <>
      <div>
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </>
  );
}

export default MiniDash;
