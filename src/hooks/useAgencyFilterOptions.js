import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';

const useAgencyFilterOptions = () => {
  const [agencies, setAgencies] = useState([]);
  const api = useApi();

  useEffect(() => {
    const request_url = '/agency_accounts/agencies'
    const fetchAgencies = async ()  => {
      const response = await api.get(request_url);
      setAgencies(response.ok ? response.body.data : null);
    };
    fetchAgencies();
  }, [api])

  return agencies;
};

export default useAgencyFilterOptions;
