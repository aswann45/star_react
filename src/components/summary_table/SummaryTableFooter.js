import StyledCell from './StyledCell';
function SummaryTableFooter({ data, formats, subtotal }) {

  const zip = (a, b) => a.map((k, i) => [k, b[i]]);

  return (
    <>
      <tfoot className={'SummaryTableFooter'}>
      {
        subtotal &&
        <tr>
          <td style={{fontWeight: 'bold'}} colSpan={data.length}>{'Subtotal:'}</td>
        </tr>
      }
        <tr>
          {
            zip(data, formats).map(
              (dataFormat, index) =>
                <StyledCell data={dataFormat[0]} format={dataFormat[1]} key={index}/>
              
            )
          }
        </tr>
      </tfoot>
    </>
  );
};

export default SummaryTableFooter;
