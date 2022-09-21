import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/table/DataTable';
import MemberRequestsCPFsColumns from './MemberRequestsCPFsColumns';

function MemberRequestsCPFsTable () {
  
  const [
    memberFilterOptions, 
    agencyFilterOptions, 
    accountFilterOptions, 
    programFilterOptions
  ] = useOutletContext();
  
  const columns = MemberRequestsCPFsColumns(
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
        localStorageLocation='member_requests_cpfs' 
      />
    </>
  );
};

export default MemberRequestsCPFsTable;