import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

function Sidebar({ sidebar }) {
  return (
    <>
      <Navbar sticky="top" className="flex-column Sidebar">
      {
        sidebar ?
          <LinkList links_dict={sidebar} />
        :
        <>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/">Root</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
          </Nav.Item>
        </>
      }
      </Navbar>
    </>
  );
}

function LinkList({ links_dict }) {

  return (
    <>
      {Object.entries(links_dict).map(([name, link]) => {
        if (link === "") {
          return null
        } else if (name === "Request"){
          return (
            <Nav.Item key={name}>
              <Nav.Link end as={NavLink} to={link}>{name}</Nav.Link>
            </Nav.Item>
          ); 
        } else {
          return (
            <Nav.Item key={name}>
              <Nav.Link as={NavLink} to={link}>{name}</Nav.Link>
            </Nav.Item>
          );  
        }
      })}
    </>
  );
}

export default Sidebar;
export { LinkList };
