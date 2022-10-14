import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import ApiProvider from './contexts/ApiProvider';
import UserProvider from './contexts/UserProvider';

import RootPage from './pages/RootPage';
import LoginPage from './pages/LoginPage';

import MemberRequestsPage from './pages/MemberRequestsPage';
import MemberRequestsTable from './tables/MemberRequestsTable';
import MemberRequestsCPFsTable from './tables/MemberRequestsCPFsTable';
import MemberRequestsProgLangTable from './tables/MemberRequestsProgLangTable';

import CPFFundingPage from './pages/CPFFundingPage';
import CPFFundingTable from './tables/CPFFundingTable';
import CPFHouseFundingTable from './tables/CPFHouseFundingTable';
import CPFConferenceFundingTable from './tables/CPFConferenceFundingTable';

import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';

import ProjectDetailForm from './components/ProjectDetailForm';
import RequestDetailForm from './components/RequestDetailForm';
import RecipientDetailForm from './components/RecipientDetailForm';
import RequestList from './components/RequestList';
import NotesDetail from './components/NotesDetail';
import LanguageDetail from './components/LanguageDetail';
import RequestContactDetail from './components/RequestContactDetail';
import FilesDetail from './components/FilesDetail';

import RequestModal from './components/RequestModal';

function App() {
  // modal background location logic
  let location = useLocation()
  let backgroundLocation = location?.state?.backgroundLocation
  const [isDetail, setIsDetail] = useState(false);

  return (
    <Container fluid className="App">
      <ApiProvider>
        <UserProvider>
          <DndProvider backend={HTML5Backend}>
            <Routes location={backgroundLocation || location}>
              <Route path="/" element={<RootPage isDetail={isDetail} setIsDetail={setIsDetail} />}>
                <Route index element={<LoginPage />} />
                <Route path='requests/:request_id' element={<RequestModal isDetail={isDetail} setIsDetail={setIsDetail}/>}>
                  <Route index element={<RequestDetailForm title="Request Details" />} />
                  <Route path="members_requests"
                    element={<RequestList title="Member's Other Requests" endpoint_suffix='/members_requests' />} />
                  <Route path="child_requests"
                    element={<RequestList showMember title="Child Requests" endpoint_suffix='/children' />}/>
                  <Route path="project_details"
                    element={<ProjectDetailForm title='Project Details'/>} />
                  <Route path="recipient"
                    element={<RecipientDetailForm title='Project Recipient'/>} />
                  <Route path="notes"
                    element={<NotesDetail title='Notes'/>} />
                  <Route path="contact"
                    element={<RequestContactDetail title='Contacts'/>} />
                  <Route path="language"
                    element={<LanguageDetail title='Language'/>} />
                  <Route path="files"
                    element={<FilesDetail title='Files'/>} />
                </Route>
                <Route path="users" element={<UsersPage />}>
                  <Route path=":user_id" element={<UserPage />} />
                </Route>
                <Route path="member_requests" element={<MemberRequestsPage />}>
                  <Route index element={<MemberRequestsTable />} />
                  <Route path="cpfs" element={<MemberRequestsCPFsTable />} />
                  <Route path="prog_lang" element={<MemberRequestsProgLangTable />} />
                </Route>
                <Route path="project_funding" element={<CPFFundingPage />}>
                  <Route index element={<CPFFundingTable />} />
                  <Route path="house" element={<CPFHouseFundingTable />} />
                  <Route path="conference" element={<CPFConferenceFundingTable />} />
                </Route>


                <Route path="*" element={<Navigate to="/member_requests" />} />

              </Route>
            </Routes>
            {backgroundLocation && (
              <Routes>
                <Route path='requests/:request_id' element={<RequestModal isDetail={isDetail} setIsDetail={setIsDetail} />}>
                  <Route index element={<RequestDetailForm title="Request Details" />} />
                  <Route path="members_requests"
                    element={<RequestList title="Member's Other Requests" endpoint_suffix='/members_requests' />} />
                  <Route path="child_requests"
                    element={<RequestList showMember title="Child Requests" endpoint_suffix='/children' />}/>
                  <Route path="project_details"
                    element={<ProjectDetailForm title='Project Details'/>} />
                  <Route path="recipient"
                    element={<RecipientDetailForm title='Project Recipient'/>} />
                  <Route path="notes"
                    element={<NotesDetail title='Notes'/>} />
                  <Route path="contact"
                    element={<RequestContactDetail title='Contacts'/>} />
                  <Route path="language"
                    element={<LanguageDetail title='Language'/>} />
                  <Route path="files"
                    element={<FilesDetail title='Files'/>} />
                </Route>
              </Routes>
            )}
          </DndProvider>
        </UserProvider>
      </ApiProvider>
    </Container>
  );
}

export default App;
