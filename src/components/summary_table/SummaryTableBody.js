import SummaryTableLine from './SummaryTableLine';

function SummaryTableBody({ data, formats }) {

  const zip = (a, b) => a.map((k, i) => [k, b[i]]);

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
