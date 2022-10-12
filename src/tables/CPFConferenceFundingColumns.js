import { createColumnHelper } from '@tanstack/react-table';
import Stack from 'react-bootstrap/Stack';
import RowSelectCheckbox from '../components/table/RowSelectCheckbox';
import RowExpandButton from '../components/table/RowExpandButton';
import EditableTableCell from '../components/table/EditableTableCell';
import DetailExpandButton from '../components/table/DetailExpandButton';
import NotePopover from '../components/table/NotePopover';
import ProjectExcludeButton from '../components/table/ProjectExcludeButton';

function CPFConferenceFundingColumns(
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

          <ProjectExcludeButton
            table={props.table}
            row={props.row}
            stage='conference'
          />

          <NotePopover
            row={props.row}
            table={props.table}
            _requestID={props.row?.RequestID}
          />

          <NotePopover
            row={props.row}
            table={props.table}
            type='flag'
            _requestID={props.row?.RequestID}
          />

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
      header: 'Request ID',
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
      cell: info => info.getValue(),
      header: 'Request Title',
      size: 350,
      filterVariant: 'text',
    }),
    columnHelper.accessor('AnalystTitle', {
      cell: info => info.getValue(),
      header: 'Analyst Title',
      size: 350,
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
        'MilCon',
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
      header: 'Member Party',
      filterVariant: 'multi-select',
      filterValues: ['D', 'R', 'I']
    }),
    columnHelper.accessor('MemberState', {
      cell: info => info.getValue(),
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
    columnHelper.accessor('Agency', {
      cell: info => info.getValue(),
      header: 'Agency',
      size: 350,
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
      size: 350,
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
      size: 250,
      filterVariant: 'multi-select',
      filterValues: Array.from(
        new Set(
          programFilterOptions.map(program => program.Program)
        )
      ),
    }),
    columnHelper.accessor('RecipientLegalName', {
      cell: info => info.getValue(),
      header: 'Recipient',
      size: 350,
      filterVariant: 'text',
    }),
    columnHelper.accessor('RecipientCity', {
      cell: info => info.getValue(),
      header: 'Recipient City',
      filterVariant: 'text',
    }),
    columnHelper.accessor('RecipientState', {
      cell: info => info.getValue(),
      header: 'Recipient State',
      filterVariant: 'text',
    }),
    columnHelper.accessor('ProjectCity', {
      cell: info => info.getValue(),
      header: 'Project City',
      filterVariant: 'text',
    }),
    columnHelper.accessor('ProjectState', {
      cell: info => info.getValue(),
      header: 'Project State',
      filterVariant: 'text',
    }),
    columnHelper.accessor('ProjectAmountRequested', {
      cell: info => {
        const amount = new Intl.NumberFormat('en-US',).format(info.getValue());
        return amount
      },
      header: 'CPF Request $',
      filterVariant: 'number',
    }),
    columnHelper.accessor('ChamberAmount', {
      cell: info => {
        const amount = new Intl.NumberFormat('en-US',).format(info.getValue());
        return amount
      },
      header: 'Chamber $ Amount',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('ChamberAllocationD', {
      cell: info => {
        const amount = new Intl.NumberFormat('en-US',).format(info.getValue());
        return amount
      },
      header: 'Chamber Dem Allocation',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('ChamberAllocationR', {
      cell: info => {
        const amount = new Intl.NumberFormat('en-US',).format(info.getValue());
        return amount
      },
      header: 'Chamber GOP Allocation',
      filterVariant: 'number',
      inputType: 'currency',
    }),
    columnHelper.accessor('FinalAmount', {
      cell: props => EditableTableCell(props),
      header: 'Conference $ Amount',
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
    columnHelper.accessor('members_names', {
      cell: info => info.getValue().join(', '),
      header: 'House Requestors',
      size: 250,
    }),
    columnHelper.accessor('senators_names', {
      cell: info => info.getValue().join(', '),
      header: 'Senate Requestors',
    }),
    columnHelper.accessor('ProjectChamber', {
      cell: info => info.getValue(),
      header: 'Origin Chamber',
      size: 250,
      filterVariant: 'multi-select',
      filterValues: [
        'House',
        'Senate',
        'House/Senate',
      ],
    }),
  ];

  return columns;

};

export default CPFConferenceFundingColumns;
