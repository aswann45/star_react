import Stack from 'react-bootstrap/Stack';
//import { Link } from 'react-router-dom';

function AgencyAccount({ account }) {
  return (
    <Stack direction="horizontal" gap={3} className="AgencyAccount">
      <div>
        <p>
          {account.SubcommitteeShortName}
          &nbsp;&mdash;&nbsp;
          {account.Agency}
          <br />
          {account.Account}
          &nbsp;&mdash;&nbsp;
          {account.Program}
        </p>
      </div>
    </Stack>
  );
}

export default AgencyAccount;
