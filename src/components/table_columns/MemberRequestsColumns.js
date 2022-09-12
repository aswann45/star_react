//import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import RowSelectCheckbox from '../RowSelectCheckbox';
import RowExpandButton from '../RowExpandButton';
import Stack from 'react-bootstrap/Stack';
import useMemberFilterOptions from '../../hooks/useMemberFilterOptions';
import useAgencyFilterOptions from '../../hooks/useAgencyFilterOptions';
import useAccountFilterOptions from '../../hooks/useAccountFilterOptions';
import useProgramFilterOptions from '../../hooks/useProgramFilterOptions';
import EditableTableCell from '../EditableTableCell';

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
      cell: (props) => (
        <Stack
          direction='horizontal'
          style={{
            paddingLeft: `${props.row.depth * 2}rem`,
            paddingRight: '5px',
          }}
          gap={2}
        >
          <RowSelectCheckbox 
            checked={props.row.getIsSelected()}
            indeterminate={props.row.getIsSomeSelected()}
            onChange={props.row.getToggleSelectedHandler()}
          />
          {props.getValue()}
          
          {props.row?.original?._links?.child_requests ?
            <span className={'ms-auto'}>
              <RowExpandButton row={props.row} table={props.table} /> 
            </span> :
              null
            }
        </Stack>
      )
    }),

    columnHelper.accessor('RequestTitle', {
      //cell: info => info.getValue(),
      cell: props => EditableTableCell(props),
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
        'Energy and Water',
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
      cell: props => EditableTableCell(props),
      header: 'CPF Priority',
      filterVariant: 'number',
      inputType: 'multi-select',
      inputValues: Array.from(
        {length: 15}, (_, i) => i + 1
      ),
    }),
    columnHelper.accessor('Top10Ranking', {
      cell: props => EditableTableCell(props),
      header: 'Top 10 Ranking',
      filterVariant: 'number',
      inputType: 'multi-select',
      inputValues: Array.from(
        {length: 10}, (_, i) => i + 1
      ),
    }),
    columnHelper.accessor('PriorityRanking', {
      cell: props => EditableTableCell(props),
      header: 'Sub Priority',
      filterVariant: 'number',
      inputType: 'multi-select',
      inputValues: Array.from(
        {length: 70}, (_, i) => i + 1
      ),
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
    columnHelper.accessor('RequestDescription', {
      cell: props => EditableTableCell(props),
      header: 'Description',
      filterVariant: 'text',
      inputType: 'textarea',
    }),
  ];

  return columns;

};

export default MemberRequestsColumns;
