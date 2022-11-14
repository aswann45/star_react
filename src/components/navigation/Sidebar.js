import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useLocation } from 'react-router-dom';

function Sidebar({ sidebar, background }) {
  //console.log(background)
  return (
    <>
      <Navbar sticky="top" className="flex-column Sidebar">
      {
        sidebar ?
          <LinkList links_dict={sidebar} background={background} />
        :
        <>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/member_requests">
              Browse & Group Member Requests
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to="/project_funding">Fund CPFs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={NavLink} to={'/cpf_summary_tables'}>
              CPF Summary Tables
            </Nav.Link>
          </Nav.Item>
        </>
      }
      </Navbar>
    </>
  );
}

function LinkList({ links_dict }) {
  let location = useLocation();
  const background = location.state.backgroundLocation;
  //console.log(background)
  return (
    <>
      {Object.entries(links_dict).map(([name, link]) => {
        if (link === "") {
          return null
        } else if (name === "Request"){
          return (
            <Nav.Item key={name}>
              <Nav.Link end as={NavLink} to={link} state={{ backgroundLocation : background }}>{name}</Nav.Link>
            </Nav.Item>
          );
        } else {
          return (
            <Nav.Item key={name}>
              <Nav.Link as={NavLink} to={link} state={{ backgroundLocation : background }}>{name}</Nav.Link>
            </Nav.Item>
          );
        }
      })}
    </>
  );
}

export default Sidebar;
export { LinkList };
