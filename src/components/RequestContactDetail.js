import { useApi } from '../contexts/ApiProvider';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useInputChange from '../useInputChange';

import Stack from 'react-bootstrap/Stack';

import DetailSubHeader from './DetailSubHeader';
import Loader from './loaders/Loader';
import RequestContactSelect from './RequestContactSelect';
import ContactCard from './ContactCard';


function RequestContactDetail({ title }) {
  const api = useApi();
  const params = useParams(':request_id');
  //const url = location.pathname;
  const request_id = params.request_id;
  const url = request_id && `/requests/${request_id}/contact`
  const [contact, setContact] = useState();
  const [contacts, setContacts] = useState();
  const [editing, setEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [input, handleInputChange, changed, setChanged] = useInputChange();

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      setContact(response.ok ? response.body : null);
      const options_url = `/members/${response.body.MemberID}/contacts`;
      const options_data = await api.get(options_url);
      setContacts(options_data.ok ? options_data.body.data : null)
    })();
  }, [url, api]);


  const handleBlur = async (event) => {
    const key = event.target.id;
    const value = input[key];
    if (!changed[key]) {
      ;
    } else {
      setChanged({});
      const data = await api.put(`/contacts/${contact.Email}`, '', {
        body: {
          [key] : value,
          EditorID: localStorage.get('currentUserID'),
        }
      });
      if (!data.ok) {
        setFormErrors(data.body.errors.json);
      } else {
        setFormErrors({});
        setContact(data.body);
      }
    }
  };

  const handleContactSelect = async (event) => {
    const data = await api.put(`/contacts/${event.currentTarget.value}/set_request_contact`, '', {
      body:
      {
        RequestID: request_id,
        EditorID: localStorage.get('currentUserID'),
      }
    });
    if (!data.ok) {
      setFormErrors(data.body.error);
    } else {
      setFormErrors({});
      setContact(data.body);
    };
  };

  const handleEditingButtonOnClick = (event) => {
    if (editing === false) {
    setEditing(true);
    } else if (editing === true) {
      setEditing(false);
    }
  }

  return (
    <>
    <Stack gap={3} direction="horizontal">
      <DetailSubHeader title={title} />
    {(contacts && editing === false) &&
      <RequestContactSelect
        contacts={contacts}
        handleContactSelect={handleContactSelect}
        formErrors={formErrors}
      />
    }
    </Stack>
      {
        contact ?
          <ContactCard
            contact={contact}
            handleBlur={handleBlur}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
            editing={editing}
            handleEditingButtonOnClick={handleEditingButtonOnClick}
          />
          :
          <Loader obj={contact} />
      }

    </>
  );
}


export default RequestContactDetail;
