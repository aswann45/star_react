import Form from 'react-bootstrap/Form';

import InputSelect from './form/InputSelect';

function RequestContactSelect({ contacts, handleContactSelect, formErrors }){
  
  return(
    <Form className='RequestContactSelect'>
      <InputSelect
        name="ContactSelect"
        label="Select New Contact:"
        changeHandler={handleContactSelect}
        error={formErrors.ContactSelect}
      >
        <option hidden>Reassign to...</option>
        {
          contacts && 
            contacts.map(contact => <option key={contact.Email} value={contact.Email}>{contact.LastName},&nbsp;{contact.FirstName}</option>)
        }
      </InputSelect>
    </Form>
  );
}

export default RequestContactSelect;
