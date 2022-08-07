import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { useParams } from 'react-router-dom';
import Body from '../components/Body';
import AgenciesAccounts from '../components/AgenciesAccounts'

function UserPage() {
  const { user_id } = useParams();
  const [user, setUser] = useState();
  const api = useApi();

  useEffect(() => {
    (async () => {
      const response = await api.get('api/users/' + user_id);
      setUser(response.ok ? response.body : null);
    })();
  }, [api, user_id]);

  return (
    <Body sidebar>
      {user === undefined ?
        <Spinner animation="border" />
      :
        <>
        {user === null ?
          <p>User not found.</p>
        :
          <>
            <Stack direction="horizontal" gap={4}>
              <div>
                <h1>{user.FirstName} {user.LastName}</h1>
                <h5>
                  {user.UserGroup}
                  &nbsp;&mdash;&nbsp;
                  {user.Email}
                </h5>
              </div>
            </Stack>
            <AgenciesAccounts user_id={user.ID} />
          </>
        }
        </>
      }
    </Body>
  );
}

export default UserPage;
