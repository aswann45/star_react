import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/table/DataTable';
import CPFFundingColumns from './CPFFundingColumns';

function CPFFundingTable () {
  
  const [
    memberFilterOptions,
    agencyFilterOptions, 
    accountFilterOptions, 
    programFilterOptions
  ] = useOutletContext();
  
  const columns = CPFFundingColumns(
    memberFilterOptions, 
    agencyFilterOptions, 
    accountFilterOptions, 
    programFilterOptions
  );
  
  return (
    <>
      <DataTable 
        columns={columns} 
        url='/project_details/'
        localStorageLocation='project_funding' 
      />
    </>
  );
};

export default CPFFundingTable;