import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/table/DataTable';
import MemberRequestsColumns from './MemberRequestsColumns';

function MemberRequestsTable () {

  const [
    memberFilterOptions,
    agencyFilterOptions,
    accountFilterOptions,
    programFilterOptions,
    isDetail,
    setIsDetail
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
        setIsDetail={setIsDetail}
        isDetail={isDetail}
      />
    </>
  );
};

export default MemberRequestsTable;
