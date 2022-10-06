import { useState, useEffect, useMemo, memo } from 'react';
import { useApi } from '../contexts/ApiProvider';

const useMemberFilterOptions = () => {
  const [members, setMembers] = useState([]);
  const api = useApi();

  useEffect(() => {
    const request_url = '/members'
    const fetchMembers = async ()  => {
      const response = await api.get(request_url, 'limit=1000');
      setMembers(response.ok ? response.body.data : []);
    };
    fetchMembers();
  }, [])

  return members;
};

export default useMemberFilterOptions;
