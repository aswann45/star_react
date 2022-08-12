import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';

function Loader({ obj } ){

  return(
    <>
      {obj === undefined ?
        <Container className="Loader">
          <Stack gap={3} direction="horizontal">
            <h1>Loading...</h1>
            <Spinner animation="border" />
          </Stack>
        </Container>
        :
        <>
          <p>There is no data to display.</p>
          <>
            {obj !== null &&
            <p>{obj.errors}</p>
            }
          </>
        </>
      }
    </>
  );
}

export default Loader;
