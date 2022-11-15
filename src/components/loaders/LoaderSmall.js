import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';

function LoaderSmall({ obj, ...props }) {

  return(
    <>
      {obj === undefined ?
        <Container className="LoaderSmall">
          <Spinner animation="border" />
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

export default LoaderSmall;
