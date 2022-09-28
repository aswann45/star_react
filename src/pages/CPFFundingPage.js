import { Outlet } from 'react-router-dom';
import TopBarNav from '../components/navigation/TopBarNav';

import useMemberFilterOptions from '../hooks/useMemberFilterOptions';
import useAgencyFilterOptions from '../hooks/useAgencyFilterOptions';
import useAccountFilterOptions from '../hooks/useAccountFilterOptions';
import useProgramFilterOptions from '../hooks/useProgramFilterOptions';


function CPFFundingPage () {
  const memberFilterOptions = useMemberFilterOptions();
  const agencyFilterOptions = useAgencyFilterOptions();
  const accountFilterOptions = useAccountFilterOptions();
  const programFilterOptions = useProgramFilterOptions();
  
  const topBarNavLinks = {
    'All CPF Funding':  '/project_funding',
    'House Funding': './house',
    'Conference Funding': './conference',
  }
  
  return (
    <>
      <TopBarNav topBarNavLinks={topBarNavLinks} />
      <Outlet context={
        [memberFilterOptions, agencyFilterOptions, accountFilterOptions, programFilterOptions]
      } />
    </>
  );
};

export default CPFFundingPage;