import { createColumnHelper } from '@tanstack/react-table';
import Stack from 'react-bootstrap/Stack';

import RowSelectCheckbox from '../components/table/RowSelectCheckbox';
import RowExpandButton from '../components/table/RowExpandButton';
import EditableTableCell from '../components/table/EditableTableCell';
import DetailExpandButton from '../components/table/DetailExpandButton';
import NotePopover from '../components/table/NotePopover';

function MemberRequestsCPFsColumns(
  memberFilterOptions,
  agencyFilterOptions, 
  accountFilterOptions, 
  programFilterOptions
) {
  
  const columnHelper = createColumnHelper(); 
  const urlPrefix = '/requests/'
  
  const columns = [
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
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
          
          <DetailExpandButton 
            endpoint={`${urlPrefix}${props.row?.original?.ID}`} 
            ID={props.row?.original?.ID}
            setIsDetail={props.table.options.meta?.setIsDetail} 
          />
          
          <NotePopover row={props.row} />
          
          <NotePopover row={props.row} type='flag' />
          
          
          <span className={'ms-auto'}>
            <RowExpandButton row={props.row} table={props.table} /> 
          </span>
        </Stack>
      )
    }),
    
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
        {props.getValue()}
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

export default MemberRequestsCPFsColumns;
