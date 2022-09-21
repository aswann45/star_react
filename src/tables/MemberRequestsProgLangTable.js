import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/table/DataTable';
import MemberRequestsProgLangColumns from './MemberRequestsProgLangColumns';

function MemberRequestsProgLangTable () {
  
  const [
    memberFilterOptions, 
    agencyFilterOptions, 
    accountFilterOptions, 
    programFilterOptions
  ] = useOutletContext();
  
  const columns = MemberRequestsProgLangColumns(
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
        getURL='/requests/prog_lang'
      />
    </>
  );
};

export default MemberRequestsProgLangTable;