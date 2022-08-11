import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ApiProvider from './contexts/ApiProvider';
import Header from './components/Header';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import RootPage from './pages/RootPage';
import LoginPage from './pages/LoginPage';
import DetailPage from './pages/DetailPage';
import ProjectDetailForm from './components/ProjectDetailForm';
import RequestDetailForm from './components/RequestDetailForm';
import RecipientDetailForm from './components/RecipientDetailForm';
import RequestList from './components/RequestList';
import NotesDetail from './components/NotesDetail';

function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
        <Header />
          <Routes>
            <Route path="/" element={<RootPage />}>
              <Route path="users" element={<UsersPage />}>
                <Route path=":user_id" element={<UserPage />} />
              </Route>
              <Route path="member_requests/*" element={<DetailPage />}>
                <Route path=":request_id/members_requests" 
                  element={<RequestList />}/>
                <Route path=":request_id/project_details" 
                  element={<ProjectDetailForm />} />
                <Route path=":request_id/recipient"
                  element={<RecipientDetailForm />} />
                <Route path=":request_id/notes"
                  element={<NotesDetail />} />
                <Route path=":request_id"
                  element={<RequestDetailForm />} />
              </Route>
              <Route path="login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );
}

export default App;
