import { Outlet } from 'react-router-dom';
import TopBarNav from '../components/navigation/TopBarNav';
import useMemberFilterOptions from '../hooks/useMemberFilterOptions';

function CPFSummaryTables () {
  const memberOptions = useMemberFilterOptions();
  const subcommitteeOptions = [
    {
      id: 9,
      name: 'Ag',
    },
    {
      id: 17,
      name: 'CJS',
    },
    {
      id: 10,
      name: 'Defense',
    },
    {
      id: 14,
      name: 'Energy & Water',
    },
    {
      id: 19,
      name: 'FSGG',
    },
    {
      id: 15,
      name: 'Homeland',
    },
    {
      id: 13,
      name: 'Labor HHS',
    },
    {
      id: 12,
      name: 'Interior',
    },
    {
      id: 16,
      name: 'MilCon VA',
    },
    
    {
      id: 18,
      name: 'THUD',
    },
  ]
  const topBarNavLinks = {
    'Member CPF Summaries': '/cpf_summary_tables',
    'Conference Disclosure Tables': './conference_disclosure_table',
  }

  return (
    <>
      <TopBarNav topBarNavLinks={topBarNavLinks} />
      <Outlet context={[
        memberOptions,
        subcommitteeOptions
      ]}/>
    </>
  );
};

export default CPFSummaryTables;
