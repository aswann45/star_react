import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper();
  
const MemberRequestsColumns = [
  columnHelper.accessor('ID', {
    cell: info => info.getValue(),
    header: 'ID',
  }),
  columnHelper.accessor('RequestTitle', {
    cell: info => info.getValue(),
    header: 'Request Title',
  }),
  columnHelper.accessor('Subcommittee', {
    cell: info => info.getValue(),
    header: 'Subcommittee',
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
