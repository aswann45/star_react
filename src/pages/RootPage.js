import { Outlet } from 'react-router-dom';
import Header from '../components/navigation/Header';
import Sidebar from '../components/navigation/Sidebar';

function RootPage() {
  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />
    </>
  );
}

export default RootPage;
