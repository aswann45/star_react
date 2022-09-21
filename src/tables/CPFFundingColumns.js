import { createColumnHelper } from '@tanstack/react-table';
import Stack from 'react-bootstrap/Stack';
import RowSelectCheckbox from '../components/table/RowSelectCheckbox';
import RowExpandButton from '../components/table/RowExpandButton';
import EditableTableCell from '../components/table/EditableTableCell';
import DetailExpandButton from '../components/table/DetailExpandButton';
import NotePopover from '../components/table/NotePopover';

function CPFFundingColumns(
  memberFilterOptions, 
  agencyFilterOptions, 
  accountFilterOptions, 
  programFilterOptions
) {
  const columnHelper = createColumnHelper();
    
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
            endpoint={`/requests/${props.row?.original?.RequestID}`}
            RequestID={props.row?.original?.RequestID} 
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
    columnHelper.accessor('ConferenceAllocationHouse', {
      cell: props => EditableTableCell(props),
      header: 'Conference House Allocation',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('ConferenceAllocationSenate', {
      cell: props => EditableTableCell(props),
      header: 'Conference Senate Allocation',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('RequestChamber', {
      cell: info => info.getValue(),
      header: 'Origin Chamber',
      filterVariant: 'multi-select',
      inputType: 'text',
      filterValues: [
        'House',
        'Senate',
        'Bicameral',
    ],
    }),
    columnHelper.accessor('ChamberDisposition', {
      cell: info => info.getValue(),
      header: 'Request Chamber Disposition',
      filterVariant: 'multi-select',
      filterValues: [
        'Included',
        'Not Included',
        'Open',
    ],
    }),
    columnHelper.accessor('FinalDisposition', {
      cell: info => info.getValue(),
      header: 'Request Final Disposition',
      filterVariant: 'multi-select',
      filterValues: [
        'Included',
        'Not Included',
        'Open',
    ],
    }),
  ];

  return columns;

};

export default CPFFundingColumns;
