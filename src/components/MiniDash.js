import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiProvider';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';

function MiniDash({ requestURL }) {
  
  const api = useApi();
  const [data, setData] = useState([]);
  
  const fetchData = useCallback(async () => {
    const response = await api.get(requestURL);
    setData(response.ok ? response.body : null);
  }, [requestURL])

  useEffect(() => {
    fetchData();
  }, [fetchData])

  return (
    <div>
      <Table 
        striped={true}
        hover={true}
        size={'sm'}
      >
        <thead>
          <tr>
            <th>
              Origination
            </th>
            <th>
              Party  
            </th>
            <th>
              # Projects
            </th>
            <th>
              $ Chamber
            </th>
            <th>
              $ Conference
            </th>
            <th>
              $ Tracking
            </th>
          </tr>
        </thead>
          {data.map(
            dataGroup => <DashboardTable dataGroup={dataGroup} key={dataGroup[0]}/>
          )}


      </Table>
    </div>
  );
};

function MiniDashPopover({ requestURL, headerText }) {
  return (
    <Popover 
      id='popover-basic' 
      className='MiniDashPopover'>
      {headerText &&
      <Popover.Header>
        {headerText}
      </Popover.Header>
      }
      <Popover.Body>
        <MiniDash requestURL={requestURL} />
      </Popover.Body>
    </Popover>
  )
}

function DashboardLine({ dataItem }) {

  const formatter = new Intl.NumberFormat('en-US');

  return (
    <tr>
      <td>
        {dataItem[0]}
      </td>
      <td>
        {dataItem[1]}
      </td>
      <td>
        {dataItem[2]}
      </td>
      <td>
        {formatter.format(dataItem[3])}
      </td>
      <td>
        {formatter.format(dataItem[4])}
      </td>
      <td>
        {formatter.format(dataItem[5])}
      </td>
    </tr>
  );
}

function DashboardTable({ dataGroup }) {

  return (
    <>
      <thead>
      <tr>
        <th style={{
            marginTop: '5px',
            paddingTop: '5px'
          }}>
          {dataGroup[0]}
        </th>
      </tr>
      </thead>
      <tbody style={{
          marginBottom: '5px',
          paddingBottom: '5px'
        }}>
      {dataGroup[1].map(
        data_item => <DashboardLine 
          dataItem={data_item} 
          key={data_item[0].concat(data_item[1])} 
        />
      )}
      </tbody>
    </>
  );
};

export default MiniDash;
export { MiniDashPopover };
