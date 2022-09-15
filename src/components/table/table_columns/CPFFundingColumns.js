//import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import RowSelectCheckbox from '../RowSelectCheckbox';
import RowExpandButton from '../RowExpandButton';
import Stack from 'react-bootstrap/Stack';
import useMemberFilterOptions from '../../../hooks/useMemberFilterOptions';
import useAgencyFilterOptions from '../../../hooks/useAgencyFilterOptions';
import useAccountFilterOptions from '../../../hooks/useAccountFilterOptions';
import useProgramFilterOptions from '../../../hooks/useProgramFilterOptions';
import EditableTableCell from '../EditableTableCell';
import DetailExpandButton from '../DetailExpandButton';
import NotePopover from '../NotePopover';

function CPFFundingColumns() {
  const columnHelper = createColumnHelper();
  const memberFilterOptions = useMemberFilterOptions();

  const agencyFilterOptions = useAgencyFilterOptions();
  const accountFilterOptions = useAccountFilterOptions();
  const programFilterOptions = useProgramFilterOptions();

    
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
            endpoint={props.row?.original?._links?.self} 
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
      header: 'Request ID',
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
    columnHelper.accessor('ChamberAmount', {
      cell: props => EditableTableCell(props),
      header: 'Chamber $ Amount',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('FinalAmount', {
      cell: props => EditableTableCell(props),
      header: 'Conference $ Amount',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('ChamberAllocationD', {
      cell: props => EditableTableCell(props),
      header: 'House Dem Allocation',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('ChamberAllocationR', {
      cell: props => EditableTableCell(props),
      header: 'House GOP Allocation',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('ConferenceAllocationD', {
      cell: props => EditableTableCell(props),
      header: 'Conference Dem Allocation',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('ConferenceAllocationR', {
      cell: props => EditableTableCell(props),
      header: 'Conference GOP Allocation',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('RequestChamber', {
      cell: props => EditableTableCell(props),
      header: 'Origin Chamber',
      filterVariant: 'multi-select',
      inputType: 'text',
      filterValues: [
        'H',
        'S',
    ],
    }),
  ];

  return columns;

};

export default CPFFundingColumns;
