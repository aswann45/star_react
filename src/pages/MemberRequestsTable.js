import DataTable from '../components/table/DataTable';
import MemberRequestsColumns from '../components/table/table_columns/MemberRequestsColumns';

function MemberRequestsTable () {
  
  const columns = MemberRequestsColumns()
  
  return (
    <DataTable columns={columns} url='/member_requests/' localStorageLocation='member_requests' />
  );
};

export default MemberRequestsTable;