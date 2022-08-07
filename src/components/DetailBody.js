import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Sidebar from './Sidebar'

function DetailBody ({ sidebar, children }) {
  return (
    <Container>
      <Stack direction="horizontal" className="DetailBody">
        <Container className="DetailContent">
          {children}
        </Container>
        {sidebar && <Sidebar sidebar_dict={sidebar} />}
      </Stack>
    </Container>
  );
}

export default DetailBody;
