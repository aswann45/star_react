import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import InputField from './form/InputField';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

function ContactCard({ contact, handleBlur, handleInputChange, formErrors, editing, handleEditingButtonOnClick }) {
  return(
    <Card className="ContactCard">
      <Card.Title>
        <Stack direction="horizontal">
          <h5>
            {contact.LastName},&nbsp;{contact.FirstName}
          </h5>
          <h5 className="ms-auto">
            Rep.&nbsp;{contact.Member.NameList}&nbsp;({contact.Member.Party})
          </h5>
        </Stack>
      </Card.Title>
      <Card.Body>
        {editing === true ? 
          <>
        <InputField
          defaultValue={contact.FirstName}
          name="FirstName"
          label="First Name"
          blurHandler={handleBlur}
          changeHandler={handleInputChange}
          error={formErrors.FirstName}
        />
        <InputField
          defaultValue={contact.LastName}
          name="LastName"
          label="Last Name"
          blurHandler={handleBlur}
          changeHandler={handleInputChange}
          error={formErrors.LastName}
        />
        <InputField
          defaultValue={contact.Email}
          name="Email"
          label="Email"
          blurHandler={handleBlur}
          changeHandler={handleInputChange}
          error={formErrors.Email}
        />
        <InputField
          defaultValue={contact.Extension}
          name="Extension"
          label="Extension"
          blurHandler={handleBlur}
          changeHandler={handleInputChange}
          error={formErrors.Extension}
        />
        <InputField
          defaultValue={contact.Title}
          name="Title"
          label="Title"
          blurHandler={handleBlur}
          changeHandler={handleInputChange}
          error={formErrors.Title}
        />
          </>
        :
        <ListGroup>
          <ListGroup.Item>
            Email: <a href={`mailto:${contact.Email}`}>{contact.Email}</a>
          </ListGroup.Item>
          <ListGroup.Item>Extension: {contact.Extension}</ListGroup.Item>
          <ListGroup.Item>Title: {contact.Title}</ListGroup.Item>
        </ListGroup>
        }
      </Card.Body>
      <Card.Footer>
      {editing === false ?
      <Button 
        size={"sm"} 
        variant={"secondary"}
        onClick={handleEditingButtonOnClick}
      >
          Edit Contact Details
        </Button>
        :
          editing === true &&
          <Button
            size={"sm"}
            variant="info"
            onClick={handleEditingButtonOnClick}
           >
            Finished Editing
          </Button>
      }
      </Card.Footer>
    </Card>
  );
}

export default ContactCard;
