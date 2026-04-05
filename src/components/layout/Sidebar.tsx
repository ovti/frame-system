import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/graph', label: 'Graf' },
  { path: '/frames', label: 'Ramki' },
  { path: '/relations', label: 'Relacje' },
  { path: '/export', label: 'Eksport' },
];

function Sidebar() {
  return (
    <aside className='min-h-[calc(100vh-73px)] w-64 border-r border-slate-200 bg-white p-4'>
      <nav className='flex flex-col gap-2'>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 transition ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
