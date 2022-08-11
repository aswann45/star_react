import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import useInputChange from '../useInputChange';
import NoteItemForm from './NoteItemForm';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import Loader from './Loader';
import PaginationBar from './PaginationBar';
import Button from 'react-bootstrap/Button';

  let counter = 1;

function NotesDetail() {
  const [notes, setNotes] = useState();
  const [newNotes, setNewNotes] = useState([]);
  const [pageMeta, setPageMeta] = useState();
  const [pageLinks, setPageLinks] = useState();
  const api = useApi();
  const location = useLocation();
  const url = location.pathname;
  const search = location.search;


  const NewNote = ({ key_id }) => {
    return <NoteItemForm new_note handleCancelNote={handleCancelNote} newNotes={newNotes} key_id={key_id} />;
  };

  function onAddButtonClick (newNotes) {
    counter = counter + 1;
    setNewNotes(newNotes => [...newNotes, <NewNote key={newNotes.length} key_id={counter} />]);
  };

  function handleCancelNote(id, newNotes) {
    //setNewNotes(newNotes.filter(item => item[key_id] === key_id));
    newNotes.forEach(item => console.log(item.props.key_id === id))
    console.log(newNotes);
  };
  
  // add options for pagination here
  useEffect(() => {
    (async () => {
      const response = await api.get(url, search);
      setNotes(response.ok ? response.body.data : null);
      setPageMeta(response.ok ? response.body['_meta'] : null);
      setPageLinks(response.ok ? response.body['_links'] : null);
    })();
  }, [api, url, search]);

  return (
    <div>
      <p>{counter}</p>
      <Button onClick={() => onAddButtonClick(newNotes)}>Add New Note</Button>
      <>
        {newNotes}
      </>
    <>
      {(notes && notes.length !== 0) ?
        <>
          {(pageMeta && pageLinks) &&
          <PaginationBar url={url} pageMeta={pageMeta} pageLinks={pageLinks} />
          }
          {
          notes.map(note => <NoteItemForm key={note.ID} 
            note={note} 
            api={api}
              />)
          }
          {(pageMeta && pageLinks) &&
          <PaginationBar url={url} pageMeta={pageMeta} pageLinks={pageLinks} />
          }
          </>
       : 
          <Loader object={notes} />
      }
    </>
    </div>
  );
}

export default NotesDetail;
