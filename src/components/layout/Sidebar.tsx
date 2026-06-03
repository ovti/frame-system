import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/app', label: 'Module functions', end: true },
  { path: '/app/dashboard', label: 'Dashboard' },
  { path: '/app/graph', label: 'Graph' },
  { path: '/app/frames', label: 'Frames' },
  { path: '/app/relations', label: 'Relations' },
  { path: '/app/export', label: 'Export' },
  { path: '/app/info', label: 'Info' },
];

function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white p-3 lg:min-h-[calc(100vh-73px)] lg:w-64 lg:border-r lg:border-b-0 lg:p-4">
      <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `shrink-0 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none lg:text-base ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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
