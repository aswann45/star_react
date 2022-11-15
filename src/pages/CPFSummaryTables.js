import { Outlet } from 'react-router-dom';
import TopBarNav from '../components/navigation/TopBarNav';
import useMemberFilterOptions from '../hooks/useMemberFilterOptions';

function CPFSummaryTables () {
  const memberOptions = useMemberFilterOptions();
  const topBarNavLinks = {
    'Member CPF Summaries': '/cpf_summary_tables',
  }

  return (
    <>
      <TopBarNav topBarNavLinks={topBarNavLinks} />
      <Outlet context={[
        memberOptions,
      ]}/>
    </>
  );
};

export default CPFSummaryTables;
