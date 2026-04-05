import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function MainLayout() {
  return (
    <div className='min-h-screen bg-slate-100 text-slate-900'>
      <Navbar />

      <div className='flex'>
        <Sidebar />

        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
