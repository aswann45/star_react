import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/table/DataTable';
import CPFConferenceFundingColumns from './CPFConferenceFundingColumns';

function CPFConferenceFundingTable () {
  const [memberFilterOptions, agencyFilterOptions, accountFilterOptions, programFilterOptions] = useOutletContext();
  const columns = CPFConferenceFundingColumns(memberFilterOptions, agencyFilterOptions, accountFilterOptions, programFilterOptions)
  
  return (
    <>
      <DataTable 
        columns={columns} 
        url='/project_details/'
        localStorageLocation='conference_project_funding' 
        getURL='/project_details/conference'
      />
    </>
  );
};

export default CPFConferenceFundingTable;