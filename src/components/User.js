import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';

function User({ user }) {
  return (
    <Stack direction="horizontal" gap={3} className="User">
      <div>
        <p>
          <Link to={`/users/${user.ID}`}>
            {user.FirstName} {user.LastName}
          </Link>
          &nbsp;&mdash;&nbsp;
          {user.UserGroup}
        </p>
        <p>
          {user.Email}
        </p>
      </div>
    </Stack>
  );
}

export default User;
