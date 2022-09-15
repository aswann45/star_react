import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Sidebar from './Sidebar';

function Body ({ sidebar, children }) {
  return (
    <Container>
      <Stack direction="horizontal" className="Body">
        <Container className="Content">
          {children}
        </Container>
        {sidebar && <Sidebar sidebar={sidebar} />}
      </Stack>
    </Container>
  );
}

export default Body;
