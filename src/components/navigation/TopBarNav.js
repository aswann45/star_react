import { Fragment } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useLocation, Link } from 'react-router-dom';

function TopBarNav({ topBarNavLinks }) {
  let location = useLocation();
  
  return (
    <>
      <Navbar className='TopBarNav'>
        <Container>
          <Nav className='me-auto' style={{margin: 0, padding: 0}}>
          {
            Object.entries(topBarNavLinks).map(([name, link]) => {
              return (
                <Fragment key={link}>
                  <Nav.Item style={{margin: 0, padding: 0}}>
                    <Nav.Link 
                      end 
                      style={{
                        marginLeft: 4, 
                        marginRight: 4, 
                        padding: 0, 
                        paddingLeft: 4, 
                        paddingRight: 4
                      }} 
                      as={NavLink} 
                      to={link}
                    >
                      {name}
                    </Nav.Link>
                  </Nav.Item>
                  <div className="vr" />
                </Fragment>
              )
            })
          }
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default TopBarNav;