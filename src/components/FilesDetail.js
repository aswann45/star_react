import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useParams, useLocation } from 'react-router-dom';

import DetailSubHeader from './DetailSubHeader';
import PaginationBar from './PaginationBar';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import InputField from './InputField';
import InputSelect from './InputSelect';
import Button from 'react-bootstrap/Button';
import Loader from './Loader';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

function FilesDetail({ title }) {

  const api = useApi();
  const params = useParams(':request_id')
  const requestID = params.request_id;
  const url = '/member_requests/' + requestID + '/files'
  const [newFile, setNewFile] = useState([]);
  const [newFileType, setNewFileType] = useState();
  const [files, setFiles] = useState();
  const [formErrors, setFormErrors] = useState({});
  const [deletedFile, setDeletedFile] = useState();
  const location = useLocation();
  const pageURL = location.pathname;
  const search = location.search;
  const [pageMeta, setPageMeta] = useState();
  const [pageLinks, setPageLinks] = useState();
    
  async function handleSubmit (event) {
    event.preventDefault();
    const url = '/files/';
    const response = await api.post(url, '', {
      body: {
        RequestID: requestID,
        Type: newFileType,
      },
    });
    const formData = new FormData();
    formData.append('file', newFile);
    const file_data = await api.post(response.body._links.save_file, '', {
      formData: formData,
      headers: {
        'enctype': 'multipart/form-data',
      }
   });
    if (!file_data.ok) {
      ;
    }
  };

  function handleFileTypeSelect (event) {
    setNewFileType(event.target.value);
  };

  function handleFileAdd (event) {
    setNewFile(event.target.files[0]);
  };

  useEffect(() => {
    (async () => {
      const response = await api.get(url, search);
      setFiles(response.ok ? response.body.data : null);
      setPageMeta(response.ok ? response.body['_meta'] : null);
      setPageLinks(response.ok ? response.body['_links'] : null);
    })();
  }, [api, url, search, deletedFile]);

  return (
    <>
      <DetailSubHeader title={title} />
      <NewFileForm 
        handleSubmit={handleSubmit} 
        handleFileAdd={handleFileAdd}
        handleFileTypeSelect={handleFileTypeSelect}
        formErrors={formErrors}
        newFile={newFile}
      />
      {(pageMeta && pageLinks) &&
        <PaginationBar 
          url={pageURL} 
          pageMeta={pageMeta} 
          pageLinks={pageLinks} 
        />
      }
      <div>
        {
          files ?
            files.map(file => <FileCard 
              key={file.ID} 
              file={file}
              setDeletedFile={setDeletedFile}
              />)
            :
            <Loader obj={files} />
        }
      </div>
    </>
  );
};

function FileCard({ file, setDeletedFile }) {
  const api = useApi();
  async function handleDownloadButtonClick (file_url) {
    const response = await api.get(file_url);
    //const response = new Response(response_obj);
    if (!response.ok) {
      console.log('The reponse is not ok!')
    } else {
      const fileBlob = await response.blob();
      const fileURL = URL.createObjectURL(fileBlob);
      let tempLink = document.createElement('a');
      let disposition = response.headers.get('content-disposition');
      let fileName = (disposition && disposition.indexOf('attachment') !== -1) ? disposition.split('filename=')[1] : ''
      tempLink.href = fileURL;
      if (fileName !== '') {
        tempLink.setAttribute('download', fileName);
        tempLink.click();
      } else {
        window.open(fileURL);
      }
    }
  }

  async function handleRemoveButtonClick (file_url) {
    const response = await api.delete(file_url);
    if (!response.ok) {
      console.log('The response is not ok!')
    } else {
      setDeletedFile(file_url)
    }
  }

  return(
    <Card className="FileCard">
      <Card.Title>
        <Stack direction="horizontal" gap={1}>
          <h5>{file.Type}</h5>
          <Button 
            className={'ms-auto'}
            size={'sm'}
            onClick={() => handleDownloadButtonClick(file._links.download_file)}
          >
            Download File
          </Button>
          <Button 
            variant={'danger'} 
            size={'sm'}
            onClick={() => handleRemoveButtonClick(file._links.self)}
          >
            Remove File
          </Button>
        </Stack>
      </Card.Title>
      <Card.Body>
        {!file.Path &&
        <Alert variant={'danger'}>Missing file location!</Alert>
        }
        <InputField 
          name={file.ID}
          as_type="textarea"
          helperText="File notes"
        />
        <Form.Check
            className="RevisionSwitch"
            type="switch"
            id="NeedsRevision"
            label="Needs Revision"
          />
      </Card.Body>
      <Card.Footer>
        {file.DateAdded &&
          <p>Date Added: {file.DateAdded}</p>
        }
        {(file.LastDownload && file.LastDownloadedBy) &&
          <p>Last Downloaded By: {file.LastDownloadedBy} on {file.LastDownload}</p>
        }
        <p>File ID: {file.ID}</p>
      </Card.Footer>
    </Card>

  );
};

function NewFileForm({ handleSubmit, handleFileTypeSelect, handleFileAdd, formErrors, newFile }) {

  return (
    <Form onSubmit={handleSubmit} className="NewFileForm">
      <Form.Text>Upload a new file for this request.</Form.Text>
      <Stack direction="horizontal">
        <InputSelect 
          name={"Type"}
          changeHandler={handleFileTypeSelect}
          error={formErrors.Type}
        >
          <option value="" hidden>Select file type...</option>
          <option value="Request Letter">Request Letter</option>
          <option value="Support Letter">Suppport Letter</option>
          <option value="Financial File">Financial File (CPFs)</option>
          <option value="Supplemental File">Supplemental File</option>
          <option value="Other">Other File</option>
        </InputSelect>
        <Button type={'submit'} className={'ms-auto'} variant={'primary'}>
          Add Selected File
        </Button>
      </Stack>
      <InputField
        name={'File'}
        type={'file'}
        changeHandler={handleFileAdd}
      />
    </Form>

  );
}

export default FilesDetail;
