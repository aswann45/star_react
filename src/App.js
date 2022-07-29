import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ApiProvider from './contexts/ApiProvider';
import Header from './components/Header';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import RootPage from './pages/RootPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
        <Header />
          <Routes>
            <Route path="/" element={<RootPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:user_id" element={<UserPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );
}

export default App;
