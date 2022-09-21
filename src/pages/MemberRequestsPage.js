import { Outlet } from 'react-router-dom';
import TopBarNav from '../components/navigation/TopBarNav';

import useMemberFilterOptions from '../hooks/useMemberFilterOptions';
import useAgencyFilterOptions from '../hooks/useAgencyFilterOptions';
import useAccountFilterOptions from '../hooks/useAccountFilterOptions';
import useProgramFilterOptions from '../hooks/useProgramFilterOptions';


function MemberRequestsPage () {  
  const memberFilterOptions = useMemberFilterOptions();
  const agencyFilterOptions = useAgencyFilterOptions();
  const accountFilterOptions = useAccountFilterOptions();
  const programFilterOptions = useProgramFilterOptions();
  
  const topBarNavLinks = {
    'All Member Requests':  '/member_requests',
    'Community Project Funding': '/member_requests/cpfs',
    'Program and Language': '/member_requests/prog_lang',
  }
  
  return (
    <>
      <TopBarNav topBarNavLinks={topBarNavLinks} />
      <Outlet context={
        [memberFilterOptions, agencyFilterOptions, accountFilterOptions, programFilterOptions]
      }/>
    </>
  );
};

export default MemberRequestsPage;