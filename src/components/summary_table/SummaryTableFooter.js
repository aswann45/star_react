import StyledCell from './StyledCell';
function SummaryTableFooter({ data, formats, subtotal, ...props }) {

  const zip = (a, b) => a.map((k, i) => [k, b[i]]);

  return (
    <>
      <tfoot className={'SummaryTableFooter'}>
      {
        subtotal &&
        <tr>
          <td style={{fontWeight: 'bold'}} colSpan={data.length}>
            {props?.subtotalHeader ? props.subtotalHeader : 'Subtotal:'}
          </td>
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
