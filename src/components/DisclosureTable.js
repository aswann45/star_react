import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider';
import SummaryTable from './summary_table/SummaryTable';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container'
import InputSelect from './form/InputSelect';
import Form from 'react-bootstrap/Form';
import LoaderSmall from './loaders/LoaderSmall';
import Button from 'react-bootstrap/Button';
import { useUser } from '../contexts/UserProvider';


function DisclosureTable({ ...props }) {
  const api = useApi();
  const user = useUser();
  const [projectsList, setProjectsList] = useState();
  const [subcommitteeID, setSubcommitteeID] = useState(
    user?.user?.UserGroupID &&
      user?.user?.UserGroupID !== 8 ?
      user?.user?.UserGroupID :
      undefined
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [memberOptions, subcommitteeOptions] = useOutletContext();

  let projectsURL = `/dashboards/conference_disclosure_table/${subcommitteeID}`;

  const fetchData = useCallback(async (url, setterFunction) => {
    const response = await api.get(url) ;
    setterFunction(response.ok ? response.body : null);
  }, [api]);

  useEffect(() => {
      setProjectsList();
      if (subcommitteeID !== undefined && subcommitteeID !== 8) {
        fetchData(projectsURL, setProjectsList);
      }
    // eslint-disable-next-line
    }, [fetchData, subcommitteeID])

  return (
    <Container fluid>
      <Stack direction={'horizontal'} gap={2}>
    <SubcommitteeSelect
      setSubcommitteeID={setSubcommitteeID}
      subcommitteeOptions={subcommitteeOptions} />
    {
      projectsList ?
        isDownloading === false ?
          <DownloadTableButton subcommitteeID={subcommitteeID} setIsDownloading={setIsDownloading} /> :
          <LoaderSmall /> :
          null
    }
      </Stack>
    <div>
      { subcommitteeID ?
        projectsList ?
        projectsList.map((table, index) => {
          return (
            <SummaryTable
              title={table.title}
              columns={table.columns}
              formats={table.column_formats}
              data={table.data}
              key={index} />
          )
      }) :
        <LoaderSmall obj={projectsList} /> :
        null
    }
    </div>
    </Container>
  );
};

function DownloadTableButton({ subcommitteeID, setIsDownloading }) {
  const api = useApi();
  async function handleDownloadButtonClick (subcommitteeID) {
    setIsDownloading(true)
    const response = await api.get(`/reporting/conference_disclosure_table/${subcommitteeID}`);
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
        setIsDownloading(false);
      } else {
        window.open(fileURL);
        setIsDownloading(false);
      }
    }
  }

  return (
    <Button
      size={'sm'}
      onClick={() => handleDownloadButtonClick(subcommitteeID)}>
      Download Excel Table
    </Button>
  );
};

function SubcommitteeSelect({ setSubcommitteeID, subcommitteeOptions }) {

  const handleSelect = (event) => setSubcommitteeID(event.currentTarget.value);

  return (
    <>
      <Form> 
        <InputSelect 
          name="SubcommitteeSelect"
          label="Select Select Subcommittee"
          changeHandler={handleSelect}>
          <>
            <option hidden>Select a Subcommittee...</option>
            {
              subcommitteeOptions &&
              subcommitteeOptions.map(sub => {
                return (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                );
              })
            }
          </>
        </InputSelect>
      </Form>
    </>
  );
};

export default DisclosureTable;
