import SummaryTableLine from './SummaryTableLine';

function SummaryTableBody({ data, formats }) {

  return (
    <>
      <tbody>
        {
          data && data.map(
            (dataItem, index) =>{
              return <SummaryTableLine
                  data={dataItem}
                  formats={formats}
                  key={index} />}
          )
        }
      </tbody>
    </>
  );
};

export default SummaryTableBody;
