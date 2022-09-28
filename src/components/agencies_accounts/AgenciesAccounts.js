import { useState, useEffect } from 'react';
import { useApi } from '../../contexts/ApiProvider';
import { useParams } from 'react-router-dom';

import Spinner from 'react-bootstrap/Spinner';
import AgencyAccount from './AgencyAccount';



function AgenciesAccounts() {
  const [accounts, setAccounts] = useState();
  const { user_id } = useParams();
  const api = useApi();

  useEffect(() => {
    (async () => {
      const response = await api.get('/users/' + user_id + '/agency_accounts');
      setAccounts(response.ok ? response.body.data : null);
    })();
  }, [api, user_id]);

  return (
    <>
      {accounts === undefined ?
        <Spinner animation="border" />
      :
        <>
          {accounts === null ?
            <p>Could not retrieve accounts.</p>
          :
            <>
              {accounts.length === 0 ?
                <p>There are no accounts to display</p>
              :
                accounts.map(account => <AgencyAccount key={account.ProgramID} account={account} />)
              }
            </>
          }
        </>
      }
    </>
  );
}

export default AgenciesAccounts;
