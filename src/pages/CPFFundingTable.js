import DataTable from '../components/table/DataTable';
import CPFFundingColumns from '../components/table/table_columns/CPFFundingColumns';

function CPFFundingTable () {
  
  const columns = CPFFundingColumns()
  
  return (
    <DataTable columns={columns} url='/project_details/' localStorageLocation='project_funding' />
  );
};

export default CPFFundingTable;