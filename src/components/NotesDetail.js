import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
//import useInputChange from '../useInputChange';
import { useLocation, useParams } from 'react-router-dom';

import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

import NoteItemForm from './NoteItemForm';
import NewNoteItem from './NewNoteItem';
import Loader from './loaders/Loader';
import PaginationBar from './navigation/PaginationBar';
import DetailSubHeader from './DetailSubHeader';


let counter = 1;

function NotesDetail({ title }) {
  const [notes, setNotes] = useState();
  const [newNotes, setNewNotes] = useState([]);
  const [pageMeta, setPageMeta] = useState();
  const [pageLinks, setPageLinks] = useState();
  const api = useApi();
  const location = useLocation();
  const url = location.pathname;
  const search = location.search;
  const params = useParams(':request_id');
  const request_id = params.request_id;

  function onAddButtonClick () {
    const newNote = {
      list_id: counter
    };
    console.log(newNote);
    counter++;
    setNewNotes(newNotes => [...newNotes, newNote]);
    console.log(newNotes);
  };

  function handleRemove(id) {
    //setNewNotes(newNotes.filter(item => item[key_id] === key_id));
    console.log(id);
    console.log(newNotes);
    const newArray = newNotes.filter((newNote) => newNote.list_id !== id);
    setNewNotes(newArray);
  };
  
  useEffect(() => {
    (async () => {
      const response = await api.get(url, search);
      setNotes(response.ok ? response.body.data : null);
      setPageMeta(response.ok ? response.body['_meta'] : null);
      setPageLinks(response.ok ? response.body['_links'] : null);
    })();
  }, [api, url, search, newNotes]);

  return (
    <div>
      <Stack direction="horizontal">
        <DetailSubHeader title={title} />
        <Button size={"sm"}
          onClick={() => onAddButtonClick(newNotes)} 
          className="ms-auto">
          Add New Note
        </Button>
      </Stack>
      <>
        {newNotes.map(new_note => <NewNoteItem 
          key={new_note.list_id} 
          list_id={new_note.list_id}
          request_id={request_id}
          api={api} 
          handleRemove={handleRemove} />)}
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
          <Loader obj={notes} />
      }
    </>
    </div>
  );
}

export default NotesDetail;
