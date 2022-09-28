import { useMemo } from 'react'; 
import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/table/DataTable';
import CPFHouseFundingColumns from './CPFHouseFundingColumns';

function CPFHouseFundingTable () {
  const [memberFilterOptions, agencyFilterOptions, accountFilterOptions, programFilterOptions] = useOutletContext();
  
  const columns = useMemo(() => CPFHouseFundingColumns(
    memberFilterOptions, 
    agencyFilterOptions, 
    accountFilterOptions, 
    programFilterOptions
  ), [
    memberFilterOptions, 
    agencyFilterOptions, 
    accountFilterOptions, 
    programFilterOptions
  ])
  
  return (
    <>
      <DataTable 
        columns={columns} 
        url='/project_details/'
        localStorageLocation='house_project_funding' 
        getURL='/project_details/house'
      />
    </>
  );
};

export default CPFHouseFundingTable;