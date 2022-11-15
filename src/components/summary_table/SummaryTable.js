import Table from 'react-bootstrap/Table';
import SummaryTableFooter from './SummaryTableFooter';
import SummaryTableHeader from './SummaryTableHeader';
import SummaryTableBody from './SummaryTableBody';

function SummaryTable({ columns, formats, data, title, subtotalData, ...props }) {

  return (
      <div>
        <Table
          striped={true}
          hover={true}
          size={'sm'}
          responsive={props?.responsive ? props.responsive : null}
          className='SummaryTable'>
          <caption >{title}</caption>
          <SummaryTableHeader columns={columns} />
          <SummaryTableBody data={data} formats={formats} />
          {
            subtotalData &&
            <SummaryTableFooter
              data={subtotalData}
              formats={formats}
              subtotal={true}
              subtotalHeader={props?.subtotalHeader ?
                props.subtotalHeader :
                null }
              />
          }
        </Table>
      </div>
  );
};

export default SummaryTable;
