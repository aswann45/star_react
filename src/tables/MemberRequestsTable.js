import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/table/DataTable';
import MemberRequestsColumns from './MemberRequestsColumns';

function MemberRequestsTable () {
  
  const [
    memberFilterOptions, 
    agencyFilterOptions, 
    accountFilterOptions, 
    programFilterOptions
  ] = useOutletContext();
  
  const columns = MemberRequestsColumns(
    memberFilterOptions, 
    agencyFilterOptions, 
    accountFilterOptions, 
    programFilterOptions
  );
  
  return (
    <>
      <DataTable 
        columns={columns} 
        url='/requests/'
        localStorageLocation='member_requests' 
        allowGrouping={true}
      />
    </>
  );
};

export default MemberRequestsTable;