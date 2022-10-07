import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/table/DataTable';
import CPFFundingColumns from './CPFFundingColumns';

function CPFFundingTable () {

  const [
    memberFilterOptions,
    agencyFilterOptions,
    accountFilterOptions,
    programFilterOptions,
    isDetail,
    setIsDetail
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
        setIsDetail={setIsDetail}
        isDetail={isDetail}
      />
    </>
  );
};

export default CPFFundingTable;
