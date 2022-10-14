import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import useInputChange from '../useInputChange';
import { useParams, useLocation, useOutletContext } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

import Loader from './loaders/Loader';
import InputField from './form/InputField';
import InputSelect from './form/InputSelect';
import PaginationBar from './navigation/PaginationBar';
import DetailSubHeader from './DetailSubHeader';


function FilesDetail({ title }) {
  const [request_url, request_id] = useOutletContext();
  const api = useApi();
  const url = request_url + '/files'
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
        RequestID: request_id,
        Type: newFileType,
      },
    });
    const formData = new FormData();
    formData.append('file', newFile);
    const file_data = await api.post(`/files/${response.body.ID}/save_file`, '', {
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
          keepBackground={true}
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
  async function handleDownloadButtonClick (file_id) {
    const response = await api.get(`/files/${file_id}/download_file`);
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

  async function handleRemoveButtonClick (file_id) {
    const response = await api.delete(`/files/${file_id}`);
    if (!response.ok) {
      console.log('The response is not ok!')
    } else {
      setDeletedFile(`/files/${file_id}`)
    }
  }

  const [formErrors, setFormErrors] = useState({});
  const [input, handleInputChange, changed, setChanged] = useInputChange();
  const handleBlur = async (event) => {
    const key = event.target.id;
    const value = input[key];
    if (!changed[key]) {
      ;
    } else {
      setChanged({});
      const data = await api.put(`/files/${file.ID}`, '', {
        body: {
          [key]: value,
          EditorID: localStorage.getItem('currentUserID')
        }
      });
      if (!data.ok) {
        setFormErrors(data.body.errors.json);
      } else {
        setFormErrors({});
      }
    }
  };

  return(
    <Card className="FileCard">
      <Card.Title>
        <Stack direction="horizontal" gap={1}>
          <h5>{file.Type}</h5>
          <Button
            className={'ms-auto'}
            size={'sm'}
            onClick={() => handleDownloadButtonClick(file.ID)}
          >
            Download File
          </Button>
          <Button
            variant={'danger'}
            size={'sm'}
            onClick={() => handleRemoveButtonClick(file.ID)}
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
          name="FileNotes"
          defaultValue={file.FileNotes}
          as_type="textarea"
          helperText="File notes"
          blurHandler={handleBlur}
          changeHandler={handleInputChange}
          error={formErrors.Note}
        />
        <Form.Check
            className="RevisionSwitch"
            type="switch"
            id="NeedsRevision"
            label="Needs Revision"
            defaultValue={file.NeedsRevision}
            onBlur={handleBlur}
            onChange={handleInputChange}
            error={formErrors.Note}
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
          <option value="Language File">Language File</option>
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
