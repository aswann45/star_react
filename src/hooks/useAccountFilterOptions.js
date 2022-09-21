import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';

const useAccountFilterOptions = () => {
  const [accounts, setAccounts] = useState([]);
  const api = useApi();

  useEffect(() => {
    const request_url = '/agency_accounts/accounts'
    const fetchAccounts = async ()  => {
      const response = await api.get(request_url);
      setAccounts(response.ok ? response.body.data : null);
    };
    fetchAccounts();
  }, [])

  return accounts;
};

export default useAccountFilterOptions;
