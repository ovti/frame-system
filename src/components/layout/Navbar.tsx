import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className='border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6'>
      <Link
        to='/'
        className='inline-block cursor-pointer rounded-lg text-2xl font-bold text-slate-900 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:text-3xl'
      >
        GRAGRAFRAME
      </Link>
    </header>
  );
}

export default Navbar;
