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

function MemberCPFSummaryTable({ ...props }) {
  const api = useApi();
  const [member, setMember] = useState();
  const [projectsList, setProjectsList] = useState();
  const [chamberSummary, setChamberSummary] = useState();
  const [conferenceSummary, setConferenceSummary] = useState();
  const [memberID, setMemberID] = useState(2);
  const [memberOptions] = useOutletContext();
  const [isDownloading, setIsDownloading] = useState(false);

  let memberURL = `/members/${memberID}`;
  let projectsURL = `/dashboards/member_cpf_list/${memberID}`;
  let chamberURL = `/dashboards/member_chamber_cpf_summary/${memberID}`;
  let conferenceURL = `/dashboards/member_conference_cpf_summary/${memberID}`;

  const fetchData = useCallback(async (url, setterFunction) => {
    const response = await api.get(url) ;
    setterFunction(response.ok ? response.body : null);
  }, [api]);

  useEffect(() => {
    fetchData(memberURL, setMember);
    fetchData(projectsURL, setProjectsList);
    fetchData(chamberURL, setChamberSummary);
    fetchData(conferenceURL, setConferenceSummary);
    // eslint-disable-next-line
  }, [fetchData, memberID])

  return (
    <Container fluid>
    <MemberSelect setMemberID={setMemberID} memberOptions={memberOptions} />
    <div>
      {
        member &&
        <h1>{member.NameList}</h1>
      }
    </div>
    <Stack direction={'horizontal'} gap={3}>
    <span>
      {
        chamberSummary ?
        chamberSummary.map((table, index) => {
          return (
            <SummaryTable
              title={`${table.title} (Chamber):`}
              columns={table.columns}
              formats={table.column_formats}
              data={table.data}
              subtotalData={table.totals}
              key={index}
              subtotalHeader={`Total ${table.title}:`} />
          );
        }) :
        <LoaderSmall obj={chamberSummary}  />
      }
      </span>
      <div className={'vr'} />
      <span className='align-self-start'>
        {
          conferenceSummary ?
            isDownloading === false ?
              <DownloadTableButton memberID={memberID} setIsDownloading={setIsDownloading} /> :
              <LoaderSmall /> :
            null
        }
        {
          conferenceSummary ?
          conferenceSummary.map((table, index) => {
            return (
              <SummaryTable
                title={`${table.title} (Conference):`}
                columns={table.columns}
                formats={table.column_formats}
                data={table.data}
                subtotalData={table.totals}
                key={index}
                subtotalHeader={`Total ${table.title}:`} />
            );
          }) :
          <LoaderSmall obj={conferenceSummary} />
        }
        
      </span>
    </Stack>
    <div>
      {
        projectsList ?
        projectsList.map((table, index) => {
          return (
            <SummaryTable
              title={table.title}
              columns={table.columns}
              formats={table.column_formats}
              data={table.data}
              subtotalData={table.totals}
              key={index} />
          )
      }) :
        <LoaderSmall obj={projectsList} />
    }

    </div>
    </Container>
  );
};


function DownloadTableButton({ memberID, setIsDownloading }) {
  const api = useApi();
  async function handleDownloadButtonClick (memberID) {
    setIsDownloading(true)
    const response = await api.get(`/reporting/member_conference_cpf_summary/${memberID}`);
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
      onClick={() => handleDownloadButtonClick(memberID)}>
      Download Excel Table
    </Button>
  );
};

function MemberSelect({ setMemberID, memberOptions }) {

  const handleSelect = (event) => setMemberID(event.currentTarget.value);

  return (
    <>
      <Form>
        <InputSelect name="MemberSelect"
          label="Select Member"
          changeHandler={handleSelect}>
          <>
            <option hidden>Select a Member...</option>
            {
              memberOptions &&
              memberOptions.map(member => {
                return (
                  <option key={member.ID} value={member.ID}>
                    {member.NameList} ({member.Party}{member.District ? ` ${member.District}` : ''})
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

export default MemberCPFSummaryTable;
