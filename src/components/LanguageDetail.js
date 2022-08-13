import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import LanguageItemForm from './LanguageItemForm';
import NewLanguageItem from './NewLanguageItem';
import { useLocation, useParams } from 'react-router-dom';
import Loader from './Loader';
import PaginationBar from './PaginationBar';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

let counter = 1;

function LanguageDetail() {
  const [languages, setLanguages] = useState();
  const [newLanguages, setNewLanguages] = useState([]);
  const [pageMeta, setPageMeta] = useState();
  const [pageLinks, setPageLinks] = useState();
  const api = useApi();
  const location = useLocation();
  const url = location.pathname;
  const search = location.search;
  const params = useParams(':request_id');
  const request_id = params.request_id;

  function onAddButtonClick () {
    const newLanguage = {
      list_id: counter
    };
    counter++;
    setNewLanguages(newLanguages => [...newLanguages, newLanguage]);
  };

  function handleRemove(id) {
    const newArray = newLanguages.filter((newLanguage) => newLanguage.list_id !== id);
    setNewLanguages(newArray);
  };
  
  useEffect(() => {
    (async () => {
      const response = await api.get(url, search);
      setLanguages(response.ok ? response.body.data : null);
      setPageMeta(response.ok ? response.body['_meta'] : null);
      setPageLinks(response.ok ? response.body['_links'] : null);
    })();
  }, [api, url, search, newLanguages]);

  return (
    <div>
      <Button size={'sm'} onClick={() => onAddButtonClick(newLanguages)}>Add New Language</Button>
      <>
        {newLanguages.map(new_language => <NewLanguageItem 
          key={new_language.list_id} 
          list_id={new_language.list_id}
          request_id={request_id}
          api={api} 
          handleRemove={handleRemove} />)}
      </>
      <Stack gap={2}>
        {(languages && languages.length !== 0) ?
          <>
            {(pageMeta && pageLinks) &&
            <PaginationBar url={url} pageMeta={pageMeta} pageLinks={pageLinks} />
            }
            {
            languages.map(language => <LanguageItemForm key={language.ID} 
              language={language} 
              api={api}
                />)
            }
            {(pageMeta && pageLinks) &&
            <PaginationBar url={url} pageMeta={pageMeta} pageLinks={pageLinks} />
            }
            </>
         : 
            <Loader obj={languages} />
        }
      </Stack>
    </div>
  );
}

export default LanguageDetail;
