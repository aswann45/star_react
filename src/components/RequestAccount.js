import { useState, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputSelect from './InputSelect';
import { useApi} from '../contexts/ApiProvider';

function RequestAccount({ object }) {

  const [agencies, setAgencies] = useState();
  const [accounts, setAccounts] = useState();
  const [programs, setPrograms] = useState();

  const [formErrors, setFormErrors] = useState({});
  const request_url = '/member_requests/' + object.ID

  const [agency_id, setAgencyID] = useState(object.AgencyID);
  const agency_url = '/agency_accounts/available_agencies/' + object.SubcommitteeID
  const [account_id, setAccountID] = useState(object.AccountID);
  const account_url  = '/agency_accounts/available_accounts/' + agency_id
  const program_url = '/agency_accounts/available_programs/' + account_id

  const api = useApi();

  const [input, setInput] = useState({
    AgencyID: object.AgencyID,
    AccountID: object.AccountID,
    ProgramID: object.ProgramID
  });

  const handleProgramChange = async (event) => {
      setInput({
        ...input,
        [event.currentTarget.id]: event.currentTarget.value
      });
      const data = await api.put(request_url, '', {
        body: 
        {
          [event.currentTarget.id]: event.currentTarget.value
        }
      });
      if (!data.ok) {
        setFormErrors(data.body.error);
      } else {
        setFormErrors({});
      }
  };

  const handleAccountChange = async (event) => {
    setInput({
      ...input,
      AccountID: event.currentTarget.value,
      ProgramID: null
    });
    setAccountID(event.currentTarget.value);
    const data = await api.put(request_url, '', {
      body: 
      {
        AccountID: event.currentTarget.value,
        ProgramID: null
      }
    });
    if (!data.ok) {
      setFormErrors(data.body.error);
    } else {
      setFormErrors({});
    }
  };
  
  const handleAgencyChange = async (event) => {
    setInput({
      ...input,
      AgencyID: event.currentTarget.value,
      AccountID: null,
      ProgramID: null
    });
    setAgencyID(event.currentTarget.value);
    setAccountID('');
    const data = await api.put(request_url, '', {
      body: 
      {
        AgencyID: event.currentTarget.value,
        AccountID: null,
        ProgramID: null
      }
    });
    if (!data.ok) {
      setFormErrors(data.body.error);
    } else {
      setFormErrors({});
    }
  };

  useEffect(() => {
    (async () => {
      const response = await api.get(agency_url);
      setAgencies(response.ok ? response.body.data : null);
    })();
  }, [api, agency_url]);

  useEffect(() => {
    (async () => {
      const response = await api.get(account_url);
      setAccounts(response.ok ? response.body.data : null);
    })();
  }, [api, account_url]);

  useEffect(() => {
    (async () => {
      const response = await api.get(program_url);
      setPrograms(response.ok ? response.body.data : null);
    })();
  }, [api, program_url]);

  return (
    <>
      <Form>
        <Stack direction="vertical" gap={2} className="RequestAccount">
          <InputSelect name="AgencyID"
            label="Agency"
            defaultValue={input.AgencyID}
            error={formErrors.Agency}
            changeHandler={handleAgencyChange}>
            <>
              {input.AgencyID === null && <option hidden></option>}
            </>
            <>
              {agencies && agencies.map(agency => {
                return (
                  <option 
                    key={agency.ID} 
                    value={agency.ID}>
                    {agency.ID}&nbsp;{agency.Agency}
                  </option>);
              })}
            </>
          </InputSelect>
          <InputSelect name="AccountID"
            label="Account"
            defaultValue={input.AccountID}
            error={formErrors.Account}
            changeHandler={handleAccountChange}>
            <>
              {input.AccountID === null && <option hidden></option>}
            </>
            <>
              {accounts && accounts.map(account => {
                return (
                  <option 
                    key={account.ID} 
                    value={account.ID}>
                    {account.ID}&nbsp;{account.Account}
                  </option>);
              })}
            </>
          </InputSelect>
          <InputSelect name="ProgramID"
            label="Program"
            defaultValue={input.ProgramID}
            error={formErrors.Program}
            changeHandler={handleProgramChange}>
            <>
              {input.ProgramID === null && <option hidden></option>}
            </>
            <>
              {programs && programs.map(program => {
                return (
                  <option 
                    key={program.ID} 
                    value={program.ID}>
                    {program.ID}&nbsp;{program.Program}
                  </option>);
              })}
            </>
          </InputSelect>
        </Stack>
      </Form>
    </>
  );
}

export default RequestAccount;
