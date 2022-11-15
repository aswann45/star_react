function StyledCell({ data, format }) {

  const formatter = new Intl.NumberFormat(
    'en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'auto',
      maximumFractionDigits: 0,
      currencySign: 'accounting'
    }
  );

  return (
    <>
      {
        format === 'index' ?
        <>
          <td style={{fontWeight: 'bold'}}>{data}</td>
        </> :
        format === 'currency' ?
        <>
            <td>{formatter.format(data).replace('$0', '$ - ')}</td>
        </> :
        <>
          <td>{data}</td>
        </>
      }
    </>
  );
};

export default StyledCell;
