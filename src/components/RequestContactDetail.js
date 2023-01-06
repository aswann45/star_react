import { useApi } from '../contexts/ApiProvider';
import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import useInputChange from '../useInputChange';

import Stack from 'react-bootstrap/Stack';

import DetailSubHeader from './DetailSubHeader';
import Loader from './loaders/Loader';
import RequestContactSelect from './RequestContactSelect';
import ContactCard from './ContactCard';


function RequestContactDetail({ title }) {
  const api = useApi();
  const params = useParams(':request_id');
  const request_id = params.request_id;
  const url = request_id && `/requests/${request_id}/contact`;
  const [,,,,,,,, memberID] = useOutletContext();

  const [contact, setContact] = useState();
  const [contacts, setContacts] = useState();
  const [editing, setEditing] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [input, handleInputChange, changed, setChanged] = useInputChange();

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      setContact(response.ok ? response.body : null);
      const options_url = `/members/${memberID}/contacts`;
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
          EditorID: localStorage.getItem('currentUserID'),
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
    let data;
    if (event.currentTarget.value === 'addNew') {
      data = {
        body : {
          FirstName : '',
          LastName : '',
          Email : '',
          Extension : '',
          Title : '', 
          MemberID : memberID,
          Office : '',
          Member : {
            NameList : 'placeholder',
            Party : 'placeholder',
          },
        },
        ok : true
      };
      setEditing(true);
      setAddNew(true);
    } else {
      data = await api.put(
      `/contacts/${event.currentTarget.value}/set_request_contact`, 
      '', 
      {
        body:
        {
          RequestID: request_id,
          EditorID: localStorage.getItem('currentUserID'),
        }
    })};
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

  const [newInput, handleNewInputChange] = useInputChange();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await api.post('/contacts/', '', {
      body: {
        MemberID: memberID,
        Email: newInput.Email,
        FirstName: newInput.FirstName,
        LastName: newInput.LastName,
        Extension: newInput.Extension,
        Title: newInput.Title,
        Office: newInput.Office,
      }
    })

    if (data.ok) {
      const assignedData = await api.put(
        `/contacts/${data.body.Email}/set_request_contact`,
        '',
        {
          body: {
            RequestID: request_id,
            EditorID: localStorage.getItem('currentUserID'),
          }
        }
      )
      if (!assignedData.ok) {
        ;
      } else {
        setContact(assignedData.body);
      }
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
          contact.MemberID ?
          <ContactCard
            contact={contact}
            handleBlur={handleBlur}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
            editing={editing}
            handleEditingButtonOnClick={handleEditingButtonOnClick}
            addNew={addNew}
            handleNewInputChange={handleNewInputChange}
            handleSubmit={handleSubmit}
          />
          : 
          <p>No contact assigned to this request.</p>
          :
          <Loader obj={contact} />
      }

    </>
  );
}


export default RequestContactDetail;
