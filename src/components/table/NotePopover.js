import { useState, useRef, forwardRef } from 'react';
import useInputChange from '../../useInputChange';
import { useApi} from '../../contexts/ApiProvider';
import { FaStickyNote, FaFlag, FaRegFlag } from 'react-icons/fa'
import { MdNoteAlt } from 'react-icons/md';

import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Form from 'react-bootstrap/Form';

import InputField from '../form/InputField';
import InputSelect from '../form/InputSelect';
//import NewNoteItem from './NewNoteItem';


function NoteForm({handleInputChange, formErrors, handleSubmit, setShow}) {

  return (
    <>
      <InputField
        as_type="textarea"
        name="Note"
        rows={5}
        changeHandler={handleInputChange}
        error={formErrors.Note}
      />
      <Stack>
        <Button
          variant="primary"
          size='sm'
          type='submit'>
          Save New Note
        </Button>
        <Button
          variant="danger"
          size='sm'
          onClick={() => setShow(false)}
          >
          Cancel
        </Button>
      </Stack>
    </>
  );
};

const RegularNote = ({
  requestID,
  input,
  handleInputChange,
  formErrors,
  setFormErrors,
  setShow
}) => {

  const note_url = '/notes/'
  const api = useApi();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await api.post(note_url, '', {
      body: {
        RequestID : requestID,
        Type: input.Type,
        Note: input.Note,
      }
    });
    if (!data.ok) {
      setFormErrors(data.body.errors.json);
    } else {
      setFormErrors({});
    }
    setShow(false);
  };

  return (
  <Popover id='popover-basic' style={{zIndex: 97000}}>
    <Form onSubmit={handleSubmit}>
      <Popover.Header as='h5'>
        <p>New Note Type</p>
        <InputSelect
          name="Type"
          defaultValue={input.Type}
          error={formErrors.Type}
          changeHandler={handleInputChange}
        >
          <option hidden></option>
          <option value="House Disposition">House Disposition</option>
          <option value="Conference Disposition">Conference Disposition</option>
          <option value="Agency Feedback">Agency Feedback</option>
          <option value="Revision">Revision</option>
          <option value="Subcommittee Transfer">Subcommittee Transfer</option>
          <option value="General/Other">General/Other</option>
        </InputSelect>
      </Popover.Header>
      <Popover.Body>
        <NoteForm
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          handleSubmit={handleSubmit}
          setShow={setShow}
        />
      </Popover.Body>
    </Form>
  </Popover>
  );
};



const FlagNote = ({
  requestID,
  input,
  handleInputChange,
  formErrors,
  setFormErrors,
  setShow,
  flagStatus,
  setFlagStatus,
  table,
  row
}) => {

  const note_url = '/notes/';
  const flag_url = `/requests/${requestID}`;
  const api = useApi();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFlagStatus(true);
    table.options.meta?.updateData(row, 'FlaggedStatus', true)
    const flagData = await api.put(flag_url, '', {
      body: {
        FlaggedStatus: true,
        EditorID: localStorage.getItem('currentUserID'),
      }
    });
    const data = await api.post(note_url, '', {
      body: {
        RequestID : requestID,
        Type: 'Flag',
        Note: input.Note,
      }
    });
    if (!data.ok) {
      setFormErrors(data.body.errors.json);
    } else {
      setFormErrors({});
    }
    setShow(false);
  };

  return (
  <Popover id='popover-basic' style={{zIndex: 97000}}>
    <Form onSubmit={handleSubmit}>
      <Popover.Header as='h5'>
        New Flag Note
      </Popover.Header>
      <Popover.Body>
        <NoteForm
          handleInputChange={handleInputChange}
          formErrors={formErrors}
          handleSubmit={handleSubmit}
          setShow={setShow}
        />
      </Popover.Body>
    </Form>
  </Popover>
  );
};



function NotePopover ({ row, table, type, _requestID }) {
  const api = useApi();
  const [input, handleInputChange] = useInputChange();
  const [formErrors, setFormErrors] = useState({});
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const requestID = _requestID ? _requestID : row.original.ID;
  const flag_url = `/requests/${requestID}`;
  const [flagStatus, setFlagStatus] = useState(row.original.FlaggedStatus);

  const handleClick = async () => {
    setFlagStatus(false);
    table.options.meta?.updateData(row, 'FlaggedStatus', false)
    const flagData = await api.put(flag_url, '', {
      body: {
        FlaggedStatus: false,
        EditorID: localStorage.getItem('currentUserID'),
      }
    });
  }

  const overlay = RegularNote({
    requestID,
    input,
    handleInputChange,
    formErrors,
    setFormErrors,
    setShow,
    flagStatus,
    setFlagStatus,
  })

  const flagOverlay = FlagNote({
    requestID,
    input,
    handleInputChange,
    formErrors,
    setFormErrors,
    setShow,
    setFlagStatus,
    table,
    row
  })

  return (
  <>
    {type === 'flag' ?

        flagStatus === true ?
        <span title='Unflag Item' className='NotePopover' onClick={handleClick}>
          <FaFlag style={{display: 'block', cursor: 'pointer'}}/>
        </span>
        :
        <OverlayTrigger show={show} trigger="click" placement="top" overlay={flagOverlay}>
          <span title='Flag Item' className='NotePopover' onClick={() => setShow(!show)}>
            <FaRegFlag style={{display: 'block', cursor: 'pointer'}}/>
          </span>
        </OverlayTrigger>


     :
    <OverlayTrigger show={show} trigger="click" placement="top" overlay={overlay}>
      <span title='Add Note' className='NotePopover' onClick={() => setShow(!show)}>
        <MdNoteAlt style={{display: 'block', cursor: 'pointer'}}/>
      </span>
    </OverlayTrigger>
    }
  </>
  );
};

export default NotePopover;
