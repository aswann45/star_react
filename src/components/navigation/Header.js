import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function Header() {
  return (
    <Navbar bg="light" sticky="top" className="Header">
      <Container>
        <Navbar.Brand>
          <h1><b>star</b> db</h1>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
