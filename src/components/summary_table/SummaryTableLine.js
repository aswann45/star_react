import StyledCell from './StyledCell';

function SummaryTableLine({ data, formats }) {

  const zip = (a, b) => a.map((k, i) => [k, b[i]]);
  //console.log(zip(data, formats))
  return (
    <>
      <tr className={'SummaryTableLine'}>

        {
          zip(data, formats).map(
            (dataFormat, index) =>
              <StyledCell data={dataFormat[0]} format={dataFormat[1]} key={index} />
          )
        }
      </tr>
    </>
  );
};

export default SummaryTableLine;
