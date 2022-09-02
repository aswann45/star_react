import { createColumnHelper } from '@tanstack/react-table';
import RowSelectCheckbox from '../RowSelectCheckbox';
import RowExpandButton from '../RowExpandButton';
import Stack from 'react-bootstrap/Stack';
import useMemberFilterOptions from '../../hooks/useMemberFilterOptions';
import useAgencyFilterOptions from '../../hooks/useAgencyFilterOptions';
import useAccountFilterOptions from '../../hooks/useAccountFilterOptions';
import useProgramFilterOptions from '../../hooks/useProgramFilterOptions';


function MemberRequestsColumns() {
  const columnHelper = createColumnHelper();
  const memberFilterOptions = useMemberFilterOptions();

  const agencyFilterOptions = useAgencyFilterOptions();
  const accountFilterOptions = useAccountFilterOptions();
  const programFilterOptions = useProgramFilterOptions();

    
  const columns = [
    columnHelper.accessor('ID', {
      cell: info => info.getValue(),
      header: 'StarID',
      filterVariant: 'number',
    }),

    columnHelper.accessor('SubmissionID', {
      header: 'ID',
      filterVariant: 'number',
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
      filterVariant: 'text',
    }),
    columnHelper.accessor('Subcommittee', {
      cell: info => info.getValue(),
      header: 'Subcommittee',
      filterVariant: 'multi-select',
      filterValues: [
        'Ag', 
        'CJS',
        'Defense',
        'Energy & Water',
        'FSGG',
        'Homeland',
        'Interior',
        'Labor HHS',
        'Leg Branch',
        'MilCon',
        'SFOPS', 
        'THUD',
    ],
    }),
    columnHelper.accessor('RequestType', {
      cell: info => info.getValue(),
      header: 'Type',
      filterVariant: 'multi-select',
      filterValues: [
        'Project',
        'Program',
        'Language',
      ]
    }),
    columnHelper.accessor('Member', {
      cell: info => info.getValue(),
      header: 'Member',
      filterVariant: 'multi-select',
      filterValues: Array.from(
        memberFilterOptions.map(member => member.NameList)
      ),
    }),
    columnHelper.accessor('Party', {
      cell: info => info.getValue(),
      header: 'Party',
      filterVariant: 'multi-select',
      filterValues: ['D', 'R', 'I']
    }),
    columnHelper.accessor('ProjectPriority', {
      cell: info => info.getValue(),
      header: 'CPF Priority',
      filterVariant: 'number',
    }),
    columnHelper.accessor('Top10Ranking', {
      cell: info => info.getValue(),
      header: 'Top 10 Ranking',
      filterVariant: 'number',
    }),
    columnHelper.accessor('PriorityRanking', {
      cell: info => info.getValue(),
      header: 'Sub Priority',
      filterVariant: 'number',
    }),
    columnHelper.accessor('Agency', {
      cell: info => info.getValue(),
      header: 'Agency',
      filterVariant: 'multi-select',
      filterValues: Array.from(
        new Set(
          agencyFilterOptions.map(agency => agency.Agency)
        )
      ),
    }),
    columnHelper.accessor('Account', {
      cell: info => info.getValue(),
      header: 'Account',
      filterVariant: 'multi-select',
      filterValues: Array.from(
        new Set (
          accountFilterOptions.map(account => account.Account)
        )
      ),
    }),
    columnHelper.accessor('Program', {
      cell: info => info.getValue(),
      header: 'Program',
      filterVariant: 'multi-select',
      filterValues: Array.from(
        new Set(
          programFilterOptions.map(program => program.Program)
        )
      ),
    }),
  ];

  return columns;

};

export default MemberRequestsColumns;
