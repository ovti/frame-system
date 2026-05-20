import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className='border-b border-slate-200 bg-white px-6 py-4 shadow-sm'>
      <Link
        to='/'
        className='inline-block text-3xl font-bold text-slate-950 transition hover:text-slate-700'
      >
        GRAGRAFRAME
      </Link>
    </header>
  );
}

export default Navbar;
