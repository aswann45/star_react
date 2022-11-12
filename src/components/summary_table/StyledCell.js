function StyledCell({ data, format }) {

  const formatter = new Intl.NumberFormat('en-US');

  return (
    <>
      {
        format === 'index' ?
        <>
          <td style={{fontWeight: 'bold'}}>{data}</td>
        </> :
        format === 'currency' ?
        <>
            <td>{formatter.format(data)}</td>
        </> :
        <>
          <td>{data}</td>
        </>
      }
    </>
  );
};

export default StyledCell;
