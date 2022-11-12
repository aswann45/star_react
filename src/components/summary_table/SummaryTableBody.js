import SummaryTableLine from './SummaryTableLine';

function SummaryTableBody({ data, formats }) {

  const zip = (a, b) => a.map((k, i) => [k, b[i]]);

  //console.log('Data', data);
  //console.log(formats);

  return (
    <>
      <tbody>
        {
          data && data.map(
            (dataItem, index) =>{
              //console.log(dataItem, formats);
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
