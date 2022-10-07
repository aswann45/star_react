import { useOutletContext } from 'react-router-dom';
import DataTable from '../components/table/DataTable';
import MemberRequestsProgLangColumns from './MemberRequestsProgLangColumns';

function MemberRequestsProgLangTable () {

  const [
    memberFilterOptions,
    agencyFilterOptions,
    accountFilterOptions,
    programFilterOptions,
    isDetail,
    setIsDetail
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
        localStorageLocation='member_requests_prog_lang'
        getURL='/requests/prog_lang'
        allowGrouping={true}
        setIsDetail={setIsDetail}
        isDetail={isDetail}
      />
    </>
  );
};

export default MemberRequestsProgLangTable;
