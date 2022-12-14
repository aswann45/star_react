import { createColumnHelper } from '@tanstack/react-table';
import Stack from 'react-bootstrap/Stack';

import RowSelectCheckbox from '../components/table/RowSelectCheckbox';
import RowExpandButton from '../components/table/RowExpandButton';
import EditableTableCell from '../components/table/EditableTableCell';
import DetailExpandButton from '../components/table/DetailExpandButton';
import NotePopover from '../components/table/NotePopover';
import ReadOnlyTableCell from '../components/table/ReadOnlyTableCell';

function MemberRequestsColumns(
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

          <NotePopover row={props.row} table={props.table} />

          <NotePopover row={props.row} table={props.table} type='flag' />


          <span className={'ms-auto'}>
            <RowExpandButton row={props.row} table={props.table} />
          </span>
        </Stack>
      )
    }),

    /*columnHelper.accessor('ID', {
      cell: info => info.getValue(),
      header: 'StarID',
      filterVariant: 'number',
    }),*/

    columnHelper.accessor('SubmissionID', {
      header: 'ID',
      filterVariant: 'text',
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

    columnHelper.accessor('ParentSubmissionID', {
      header: 'Parent ID',
      filterVariant: 'text',
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
      cell: props => ReadOnlyTableCell(props),
      header: 'Request Title',
      size: 350,
      filterVariant: 'text',
    }),
    columnHelper.accessor('AnalystTitle', {
      cell: props => EditableTableCell(props),
      header: 'Analyst Title',
      filterVariant: 'text',
    }),
    columnHelper.accessor('Subcommittee', {
      cell: props => ReadOnlyTableCell(props),
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
      cell: props => ReadOnlyTableCell(props),
      header: 'Type',
      filterVariant: 'multi-select',
      filterValues: [
        'Project',
        'Program',
        'Language',
      ]
    }),
    columnHelper.accessor('ProjectAmountRequested', {
      cell: info => {
        const amount = new Intl.NumberFormat('en-US',).format(info.getValue());
        return amount
      },
      header: 'CPF Request $',
      filterVariant: 'number',
    }),
    columnHelper.accessor('ProgramAmount', {
      cell: info => {
        const amount = new Intl.NumberFormat('en-US',).format(info.getValue());
        return amount
      },
      header: 'Programmatic Request $',
      filterVariant: 'number',
    }),
    columnHelper.accessor('Member', {
      cell: props => ReadOnlyTableCell(props),
      header: 'Member',
      filterVariant: 'multi-select',
      filterValues: Array.from(
          memberFilterOptions?.map(member => member.NameList)
      ),
    }),
    columnHelper.accessor('Party', {
      cell: props => ReadOnlyTableCell(props),
      header: 'Member Party',
      filterVariant: 'multi-select',
      filterValues: ['D', 'R', 'I']
    }),
    columnHelper.accessor('MemberState', {
      cell: props => ReadOnlyTableCell(props),
      header: 'Member State',
      filterVariant: 'multi-select',
      filterValues: [
        'AL', 'AK', 'AZ', 'AR', 'CA','CO','CT','DE','DC','FL','GA','HI','ID','IL',
        'IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV',
        'NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','PR','RI','SC','SD','TN','TX',
        'UT','VT','VA','VI','WA','WV','WI','WY'
      ]
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
      cell: props => ReadOnlyTableCell(props),
      header: 'Agency',
      size: 350,
      filterVariant: 'multi-select',
      filterValues: Array.from(
        new Set(
          agencyFilterOptions?.map(agency => agency.Agency)
        )
      ),
    }),
    columnHelper.accessor('Account', {
      cell: props => ReadOnlyTableCell(props),
      header: 'Account',
      size: 350,
      filterVariant: 'multi-select',
      filterValues: Array.from(
        new Set (
          accountFilterOptions?.map(account => account.Account)
        )
      ),
    }),
    columnHelper.accessor('Program', {
      cell: props => ReadOnlyTableCell(props),
      header: 'Program',
      size: 250,
      filterVariant: 'multi-select',
      filterValues: Array.from(
        new Set(
          programFilterOptions?.map(program => program.Program)
        )
      ),
    }),
    columnHelper.accessor('RequestDescription', {
      cell: props => EditableTableCell(props),
      header: 'Description',
      filterVariant: 'text',
      inputType: 'textarea',
    }),
    columnHelper.accessor('RecipientLegalName', {
      cell: props => ReadOnlyTableCell(props),
      header: 'CPF Recipient',
      size: 350,
      filterVariant: 'text',
    }),
    columnHelper.accessor('RecipientCity', {
      cell: props => ReadOnlyTableCell(props),
      header: 'CPF Recipient City',
      filterVariant: 'text',
    }),
    columnHelper.accessor('RecipientState', {
      cell: props => ReadOnlyTableCell(props),
      header: 'CPF Recipient State',
      filterVariant: 'text',
    }),
    columnHelper.accessor('OrganizationEIN', {
      cell: props => ReadOnlyTableCell(props),
      header: 'CPF Recipient EIN',
      filterVariant: 'text',
    }),
    columnHelper.accessor('ProjectCity', {
      cell: props => ReadOnlyTableCell(props),
      header: 'CPF Project City',
      filterVariant: 'text',
    }),
    columnHelper.accessor('ProjectState', {
      cell: props => ReadOnlyTableCell(props),
      header: 'CPF Project State',
      filterVariant: 'text',
    }),
    columnHelper.accessor('ChamberDisposition', {
      cell: props => ReadOnlyTableCell(props),
      header: 'Chamber Disposition',
      filterVariant: 'multi-select',
      filterValues: [
        'Included',
        'Not Included',
        'Open',
      ]
    }),
    columnHelper.accessor('FinalDisposition', {
      cell: props => ReadOnlyTableCell(props),
      header: 'Final Disposition',
      filterVariant: 'multi-select',
      filterValues: [
        'Included',
        'Not Included',
        'Open',
      ]
    }),
    columnHelper.accessor('RequestChamber', {
      cell: props => ReadOnlyTableCell(props),
      header: 'Origin Chamber',
      filterVariant: 'multi-select',
      inputType: 'text',
      filterValues: [
        'House',
        'Senate',
      ],
    }),
  ];

  return columns;

};

export default MemberRequestsColumns;
