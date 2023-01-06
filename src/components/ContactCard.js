import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import InputField from './form/InputField';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ContactCard({ 
  contact, 
  handleBlur, 
  handleInputChange, 
  formErrors, 
  editing, 
  handleEditingButtonOnClick,
  addNew,
  handleNewInputChange,
  handleSubmit
}) {
  return(
    <Card className="ContactCard">
      <Form onSubmit={handleSubmit}>
      <Card.Title>
        <Stack direction="horizontal">
          {
            addNew === true ? 
              <>
              <h5>New Contact</h5>
              </>
            :
              <>
                <h5>
                  {contact.LastName},&nbsp;{contact.FirstName}
                </h5>
                <h5 className="ms-auto">
                  Rep.&nbsp;{contact.Member.NameList}&nbsp;({contact.Member.Party})
                </h5>
              </>
          }
        </Stack>
      </Card.Title>
      <Card.Body>
        {editing === true && addNew !== true ?
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
        : editing === true && addNew === true ?
          <>
              <InputField
                name="FirstName"
                label="First Name"
                changeHandler={handleNewInputChange}
                error={formErrors.FirstName}
              />
              <InputField
                name="LastName"
                label="Last Name"
                changeHandler={handleNewInputChange}
                error={formErrors.LastName}
              />
              <InputField
                name="Email"
                label="Email"
                changeHandler={handleNewInputChange}
                error={formErrors.Email}
              />
              <InputField
                name="Extension"
                label="Extension"
                changeHandler={handleNewInputChange}
                error={formErrors.Extension}
              />
              <InputField
                name="Title"
                label="Title"
                changeHandler={handleNewInputChange}
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
          editing === true && addNew === false ? 
          <Button
            size={"sm"}
            variant="info"
            onClick={handleEditingButtonOnClick}
           >
            Finished Editing
          </Button>
          : editing === true && addNew === true &&
          <Button size={'sm'} variant={'primary'} type={'submit'}>
            Add new contact
          </Button>
      }
      </Card.Footer>
      </Form>
    </Card>
  );
}

export default ContactCard;
