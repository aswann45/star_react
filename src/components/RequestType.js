import Stack from 'react-bootstrap/Stack';

function RequestType({ request }) {

  const program_amount = new Intl.NumberFormat('en-US',
  ).format(request.ProgramAmount);
  
  return (
    <>
    <Stack direction="horizontal" gap={3} className="RequestType">
      <div>
        <p>
          Request: <b>{request.RequestType}</b>
        </p>
        <>
          {request.RequestType === "Language" ?
            <p>{request.LanguageType} Language</p>
            :
            <>
              {request.RequestType === "Program" && 
                <p>{request.ProgramIncreaseDecrease}
                  {/*&nbsp;&mdash;&nbsp;*/}
                  &nbsp;${program_amount}
                </p>               
              }
            </>
          }
        </>
      </div>
    </Stack>
    </>
  );
}

export default RequestType;
