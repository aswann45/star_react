import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas'

import { useUser } from '../contexts/UserProvider';

import Header from '../components/navigation/Header';
import Sidebar from '../components/navigation/Sidebar';
import MiniDash from '../components/MiniDash';

function RootPage({isDetail, setIsDetail}) {

  const { login } = useUser();
  const loginResult = useCallback(() => login(), [login]);
  const [showSidebar, setShowSidebar] = useState(false);
  const handleShow = () => setShowSidebar(true);
  const handleClose = () => setShowSidebar(false);

  return (
    <>
      <Header handleClick={handleShow} />
      <Offcanvas
        show={showSidebar}
        onHide={handleClose}
        onClick={handleClose}
        style={{zIndex: 97000}}
      >
        <Sidebar />
      </Offcanvas>
      <Outlet context={[isDetail, setIsDetail]} />
    </>
  );
}

export default RootPage;
