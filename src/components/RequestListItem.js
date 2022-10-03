import Stack from 'react-bootstrap/Stack';
import { Link, useLocation } from 'react-router-dom';

function RequestListItem({ request, showMember }) {

  let location = useLocation();
  const background = location.state.backgroundLocation

  return (
    <Stack direction="horizontal" gap={3} className="RequestListItem">
      <div>
        <h5>
          <Link to={`/requests/${request.ID}`} state={{backgroundLocation: background}}>
            {request.SubmissionID}&nbsp;&mdash;&nbsp;
            {(request.AnalystTitle && request.AnalystTitle !== '') ?
                request.AnalystTitle
                : request.RequestTitle
            }
          </Link>
          {showMember &&
              <>
                &nbsp;&mdash;&nbsp;
                {request.Member}&nbsp;({request.Party})
              </>
          }
        </h5>
        <p>
          {request.Agency !== '' && request.Agency}&nbsp;&mdash;&nbsp;
          {request.Account !== '' && request.Account}&nbsp;&mdash;&nbsp;
          {request.Program !== '' && request.Program}
        </p>
        <p>
          <b>{request.RequestType}:</b>&nbsp;
          {request.RequestDescription}
        </p>
      </div>
    </Stack>
  );
}

export default RequestListItem;
