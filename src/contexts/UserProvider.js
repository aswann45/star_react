import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiProvider';

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState();
  const api = useApi();

  useEffect(() => {
    (async () => {
      if (api.getCurrentUser()) {
        const currentUserID = localStorage.getItem('currentUserID');
        const response = api.get(`/auth/users/${currentUserID}`)
        setUser(response.ok ? response.body : null);
      }
      else {
        setUser(null);
      }
    })();
  }, []);

  const login = async () => {
    const response = await api.login();
    setUser(response.ok ? response.body : null);
    return response.ok;
  };

  const logout = async () => {
    await api.logout();
    setUser(null)
  };

  return (
    <UserContext.Provider value ={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

function useUser() {
  return useContext(UserContext);
};

export { useUser };
export default UserProvider;
