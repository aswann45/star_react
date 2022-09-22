import Nav from 'react-bootstrap/Nav';
import { Link, useLocation } from 'react-router-dom';
import { FaExpandAlt } from 'react-icons/fa';

function DetailExpandButton({endpoint, RequestID, setIsDetail}) {
    
  let location = useLocation();
  const handleShow = () => {
    setIsDetail(true);
  }
  
  return (
    <>
      <Nav.Link 
        as={Link} 
        to={endpoint} 
        onClick={handleShow} 
        title='Show Details'
        state={{backgroundLocation: location}} 
        className='DetailExpandButton'
      >
        <FaExpandAlt style={{display: 'block'}}/>
      </Nav.Link>
    </>
  );
};

export default DetailExpandButton;