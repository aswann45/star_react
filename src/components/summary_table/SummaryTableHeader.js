function SummaryTableHeader({ columns }) {
  //console.log(columns)
  return (
    <>
      <thead className={'SummaryTableHeader'}>
        <tr>
          {
            columns && columns.map(
              column => <HeaderColumn text={column} key={column} />
            )
          }
        </tr>
      </thead>
    </>
  );
};

function HeaderColumn({ text }) {
  return (
    <>
      <th>
        {text}
      </th>
    </>
  );
}

export default SummaryTableHeader;
