import { createColumnHelper } from '@tanstack/react-table';
import RowSelectCheckbox from '../RowSelectCheckbox';
import RowExpandButton from '../RowExpandButton';
import Stack from 'react-bootstrap/Stack';

const columnHelper = createColumnHelper();
  
const MemberRequestsColumns = [
  columnHelper.accessor('ID', {
    cell: info => info.getValue(),
    header: 'StarID',
  }),

  columnHelper.accessor('SubmissionID', {
    header: 'ID',
    cell: ({ row, getValue }) => (
      <Stack
        direction='horizontal'
        style={{
          paddingLeft: `${row.depth * 2}rem`,
          paddingRight: '5px',
        }}
        gap={2}
      >
        <RowSelectCheckbox 
          checked={row.getIsSelected()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
        {getValue()}
        {row.getCanExpand() ?
          <span className={'ms-auto'}>
            <RowExpandButton row={row} /> 
          </span> :
            null
          }
      </Stack>
    )
  }),

  columnHelper.accessor('RequestTitle', {
    cell: info => info.getValue(),
    header: 'Request Title',
  }),
  columnHelper.accessor('Subcommittee', {
    cell: info => info.getValue(),
    header: 'Subcommittee',
  }),
  columnHelper.accessor('RequestType', {
    cell: info => info.getValue(),
    header: 'Type',
  }),
  columnHelper.accessor('Member', {
    cell: info => info.getValue(),
    header: 'Member',
  }),
  columnHelper.accessor('Party', {
    cell: info => info.getValue(),
    header: 'Party',
  }),
  columnHelper.accessor('ProjectPriority', {
    cell: info => info.getValue(),
    header: 'CPF Priority',
  }),
  columnHelper.accessor('Top10Ranking', {
    cell: info => info.getValue(),
    header: 'Top 10 Ranking',
  }),
  columnHelper.accessor('PriorityRanking', {
    cell: info => info.getValue(),
    header: 'Sub Priority',
  }),
  columnHelper.accessor('Agency', {
    cell: info => info.getValue(),
    header: 'Agency',
  }),
  columnHelper.accessor('Account', {
    cell: info => info.getValue(),
    header: 'Account',
  }),
  columnHelper.accessor('Program', {
    cell: info => info.getValue(),
    header: 'Program',
  }),
]
      //{Header: 'ID', accessor: 'ID'},
      //{Header: 'Request Title', accessor: 'RequestTitle'},
      //{Header: 'Subcommittee', accessor: 'Subcommittee'},
      //{Header: 'Agency', accessor: 'Agency'},
      //{Header: 'Account', accessor: 'Account'},
      //{Header: 'Program', accessor: 'Program'},
      //{Header: 'Request Type', accessor: 'RequestType'},
      //{Header: 'Member', accessor: 'Member'},
      //{Header: 'Party', accessor: 'Party'},
      //{Header: 'Project Priority', accessor: 'ProjectPriority'},
      //{Header: 'Top 10 Ranking', accessor: 'Top10Ranking'},

export default MemberRequestsColumns;
