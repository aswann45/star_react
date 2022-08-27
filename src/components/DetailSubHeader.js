import Stack from 'react-bootstrap/Stack';

function DetailSubHeader ({ title }) {
  return (
    <Stack direction="horizontal" className="DetailSubHeader">
      <h1>
        <b>
        {title && title}
        </b>
      </h1>
    </Stack>
  );
}

export default DetailSubHeader;
