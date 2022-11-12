import Table from 'react-bootstrap/Table';
import SummaryTableFooter from './SummaryTableFooter';
import SummaryTableHeader from './SummaryTableHeader';
import SummaryTableBody from './SummaryTableBody';

function SummaryTable({ columns, formats, data, title, subtotalData }) {
//console.log('Columns', columns)
  return (
      <div>
        <Table striped={true} hover={true} size={'sm'}>
          <caption>{title}</caption>
          <SummaryTableHeader columns={columns} />
          <SummaryTableBody data={data} formats={formats} />
          {
            subtotalData && <SummaryTableFooter data={subtotalData} formats={formats} subtotal={true} />
          }
        </Table>
      </div>
  );
};

export default SummaryTable;
