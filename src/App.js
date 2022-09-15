import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import ApiProvider from './contexts/ApiProvider';

//import Header from './components/Header';

import RootPage from './pages/RootPage';
import LoginPage from './pages/LoginPage';
import DetailPage from './pages/DetailPage';

import DetailModal from './components/DetailModal';

import MemberRequestsTable from './pages/MemberRequestsTable';
import CPFFundingTable from './pages/CPFFundingTable';


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
//import DataTable from './components/Table';


function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
          <DndProvider backend={HTML5Backend}>
            <Routes>
              <Route path="/" element={<RootPage />}>
                
                <Route path="users" element={<UsersPage />}>
                  <Route path=":user_id" element={<UserPage />} />
                </Route>
                
                <Route path="member_requests" element={<MemberRequestsTable />}>
                  <Route path=":request_id" element={<DetailModal />}>
                    

                    <Route index element={<RequestDetailForm title="Request Details"/>} />
                    <Route path="members_requests" 
                      element={<RequestList title="Member's Other Requests"/>} />
                    <Route path="children"
                      element={<RequestList showMember />}/>
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
                  
                </Route>
                <Route path="project_details" element={<CPFFundingTable />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              
              </Route>
            </Routes>
          </DndProvider>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );
}

export default App;


                  /*<Route path="*" element={<DetailPage />}>
                                                 
                  </Route>*/
                    
                    