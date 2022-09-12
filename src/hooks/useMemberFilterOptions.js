import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';

const useMemberFilterOptions = () => {
  const [members, setMembers] = useState([]);
  const api = useApi();

  useEffect(() => {
    const request_url = '/members'
    const fetchMembers = async ()  => {
      const response = await api.get(request_url, 'limit=450');
      setMembers(response.ok ? response.body.data : null);
    };
    fetchMembers();
  }, [api])

  return members;
};

export default useMemberFilterOptions;
