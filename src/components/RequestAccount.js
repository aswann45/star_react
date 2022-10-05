import { useState, useEffect } from 'react';
import { useApi} from '../contexts/ApiProvider';

import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';

import InputSelect from './form/InputSelect';

function RequestAccount({ url }) {

  const [object, setObject] = useState({});
  const [agencies, setAgencies] = useState();
  const [accounts, setAccounts] = useState();
  const [programs, setPrograms] = useState();
  const api = useApi();

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      setObject(response.ok ? response.body : null);
    })();
  }, [api, url])

  const [formErrors, setFormErrors] = useState({});

  const [subcommittee_id, setSubcommitteeID] = useState('');
  const [agency_id, setAgencyID] = useState('');
  const [account_id, setAccountID] = useState('');
  const [program_id, setProgramID] = useState('');

  useEffect(() => {
    setSubcommitteeID(object.SubcommitteeID);
    setAgencyID(object.AgencyID ? object.AgencyID : '');
    setAccountID(object.AccountID ? object.AccountID : '');
    setProgramID(object.ProgramID ? object.ProgramID : '');
  }, [object])

  const handleProgramChange = async (event) => {
      setProgramID(event.currentTarget.value);
      const data = await api.put(url, '', {
        body:
        {
          ProgramID: event.currentTarget.value,
          EditorID: localStorage.getItem('currentUserID'),
        }
      });
      if (!data.ok) {
        setFormErrors(data.body.error);
      } else {
        setFormErrors({});
      }
  };

  const handleAccountChange = async (event) => {
    setProgramID('');
    setAccountID(event.currentTarget.value);
    const data = await api.put(url, '', {
      body:
      {
        AccountID: event.currentTarget.value,
        ProgramID: null,
        EditorID: localStorage.getItem('currentUserID'),
      }
    });
    if (!data.ok) {
      setFormErrors(data.body.error);
    } else {
      setFormErrors({});
    }
  };

  const handleAgencyChange = async (event) => {
    setAgencyID(event.currentTarget.value);
    setAccountID('');
    setProgramID('');
    const data = await api.put(url, '', {
      body:
      {
        AgencyID: event.currentTarget.value,
        AccountID: null,
        ProgramID: null,
        EditorID: localStorage.getItem('currentUserID'),
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
      if (subcommittee_id && subcommittee_id !== '') {
        const agency_url = '/agency_accounts/available_agencies/' + subcommittee_id
        const response = await api.get(agency_url, '?limit=100');
        setAgencies(response.ok ? response.body.data : null);
      }
    })();
  }, [api, subcommittee_id]);

  useEffect(() => {
    (async () => {
      if (agency_id && agency_id !== '') {
        const account_url  = '/agency_accounts/available_accounts/' + agency_id
        const response = await api.get(account_url, '?limit=100');
        setAccounts(response.ok ? response.body.data : null);
      }
    })();
  }, [api, agency_id]);

  useEffect(() => {
    (async () => {
      if (account_id && account_id !== '') {
        const program_url = '/agency_accounts/available_programs/' + account_id
        const response = await api.get(program_url, '?limit=100');
        setPrograms(response.ok ? response.body.data : null);
      }
    })();
  }, [api, account_id]);

  return (
    <>
      <Form>
        <Stack direction="vertical" gap={1} className="RequestAccount">
          <InputSelect name="AgencyID"
            label="Agency: "
            defaultValue={agency_id}
            error={formErrors.Agency}
            changeHandler={handleAgencyChange}>
            <>
              {(agency_id === null || agency_id === undefined || agency_id === '') && <option hidden></option>}
            </>
            <>
              {agencies && agencies.map(agency => {
                return (
                  <option
                    key={agency.ID}
                    value={agency.ID}>
                    {agency.Agency}
                  </option>);
              })}
            </>
          </InputSelect>
          <InputSelect name="AccountID"
            label="Account: "
            defaultValue={account_id}
            error={formErrors.Account}
            changeHandler={handleAccountChange}>
            <>
              {(account_id === null || account_id === undefined || account_id === '') && <option hidden></option>}
            </>
            <>
              {accounts && accounts.map(account => {
                return (
                  <option
                    key={account.ID}
                    value={account.ID}>
                    {account.Account}
                  </option>);
              })}
            </>
          </InputSelect>
          <InputSelect name="ProgramID"
            label="Program: "
            defaultValue={program_id}
            error={formErrors.Program}
            changeHandler={handleProgramChange}>
            <>
              {(program_id === null || program_id === undefined || program_id === '') && <option hidden></option>}
            </>
            <>
              {programs && programs.map(program => {
                return (
                  <option
                    key={program.ID}
                    value={program.ID}>
                    {program.Program}
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
