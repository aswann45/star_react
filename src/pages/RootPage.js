import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas'

import Header from '../components/navigation/Header';
import Sidebar from '../components/navigation/Sidebar';

function RootPage() {
  
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
      <Outlet />
    </>
  );
}

export default RootPage;
