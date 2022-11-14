import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../contexts/ApiProvider';
import Popover from 'react-bootstrap/Popover';
import Table from 'react-bootstrap/Table';
import SummaryTable from './summary_table/SummaryTable'

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
        {data.map(subcommitteeTables =>
            subcommitteeTables[1].map(
              (table, index) => {
              return (<SummaryTable
                title={subcommitteeTables[0] + ' ' + table.title}
                columns={table['columns']}
                formats={table.column_formats}
                data={table.data}
                subtotalData={table.totals}
                key={index} />)}
            )
        )
      }
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

export default MiniDash;
export { MiniDashPopover };
