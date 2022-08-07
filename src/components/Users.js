import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useApi } from '../contexts/ApiProvider';
import User from './User';
import { Outlet } from 'react-router-dom';

function Users() {
  const [users, setUsers] = useState();
  const api = useApi();

  useEffect(() => {
    (async () => {
      const response = await api.get('api/users');
      if (response.ok) {
        setUsers(response.body.data);
      }
      else {
        setUsers(null);
      }
    })();
  }, [api]);

  return (
    <>
      {users === undefined ?
        <Spinner animation="border" />
      :
        <>
          {users === null ?
            <p>Could not retrieve users.</p>
          :
            <>
              {users.length === 0 ?
                <p>There are no users to display</p>
              :
                users.map(user => <User key={user.ID} user={user} />)
              }
              <Outlet />
            </>
          }
        </>
      }
    </>
  );
}

export default Users;
