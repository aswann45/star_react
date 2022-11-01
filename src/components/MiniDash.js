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
      <Table>
        <thead>
          <tr>
            <th>
              Subcommittee
            </th>
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
          </tr>
        </thead>
      {data.map(
        data_item => <DashboardLine dataItem={data_item} key={data_item.index} />
      )}
    </Table>
    </div>
  );
};

function MiniDashPopover({ requestURL, headerText }) {
  return (
    <Popover 
      id='popover-basic' 
      className='MiniDashPopover'
      zIndex={999999}>
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
        {dataItem.subcommittee}
      </td>
      <td>
        {dataItem.project_chamber}
      </td>
      <td>
        {dataItem.project_party}
      </td>
      <td>
        {dataItem.number_projects}
      </td>
      <td>
        {formatter.format(dataItem.chamber_amount)}
      </td>
      <td>
        {formatter.format(dataItem.final_amount)}
      </td>
    </tr>
  );
}

export default MiniDash;
export { MiniDashPopover };
