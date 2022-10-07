import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';

const useProgramFilterOptions = () => {
  const [programs, setPrograms] = useState([]);
  const api = useApi();

  useEffect(() => {
    const request_url = '/agency_accounts/programs'
    const fetchPrograms = async ()  => {
      const response = await api.get(request_url);
      setPrograms(response.ok ? response.body.data : []);
    };
    fetchPrograms();
  }, [])

  return programs;
};

export default useProgramFilterOptions;
