import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FaBars } from 'react-icons/fa';

function Header({ handleClick }) {
  
  
  
  return (
    <Navbar bg="light" sticky="top" className="Header">
      <Container>
        <Navbar.Brand>
          <div style={{fontSize: '30px', textAlign: 'center'}}>
            <span onClick={handleClick} style={{cursor: 'pointer'}}>
            <FaBars style={{display: 'd-inline-block',
                            width: 30,
                            height: 30,}}/>
            </span>
            &nbsp;
            <b>&nbsp;star</b>&nbsp;db
          </div>
        </Navbar.Brand> 
      </Container>
    </Navbar>
  );
}

export default Header;
