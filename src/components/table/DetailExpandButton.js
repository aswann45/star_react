import { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link, Outlet } from 'react-router-dom';
import { FaExpandAlt } from 'react-icons/fa';

import DetailModal from '../DetailModal';


function DetailExpandButton({endpoint, setIsDetail}) {
  //console.log(endpoint)
  
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(true);
    setIsDetail(true);
  }
  
  return (
    <>
      <Nav.Link as={Link} to={endpoint} onClick={handleShow} className='DetailExpandButton'>
        <FaExpandAlt style={{display: 'block'}}/>
      </Nav.Link>

      <Outlet context={[endpoint, show, setShow, setIsDetail]} />

    </>
  );
};
export default DetailExpandButton;