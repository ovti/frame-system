import { Link } from 'react-router-dom';
import FloatingBackground from '../components/common/FloatingBackground';

function LandingPage() {
  const moduleButtonClass =
    'flex h-14 w-full items-center justify-center rounded-2xl px-6 text-center text-sm font-semibold uppercase tracking-wide transition sm:w-56';

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6'>
      <FloatingBackground />

      <section className='relative z-10 flex min-h-[440px] w-full max-w-5xl items-center justify-center overflow-hidden rounded-3xl bg-white/90 px-8 py-20 text-center shadow-sm backdrop-blur-sm md:min-h-[480px] md:px-12'>
        <img
          src='/images/main4.png'
          alt=''
          aria-hidden='true'
          className='pointer-events-none absolute left-1/2 top-1/2 z-0 h-[500px] w-[640px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.10] blur-[1px]'
        />

        <div className='relative z-10'>
          <h1 className='text-5xl font-bold tracking-tight text-slate-950 md:text-7xl'>
            GRAGRAFRAME
          </h1>

          <p className='mx-auto mt-6 max-w-2xl text-2xl leading-8 text-slate-600'>
            GRAPH GRAMMAR-BASED
          </p>

          <p className='mx-auto mt-2 max-w-2xl text-2xl leading-8 text-slate-600'>
            FRAME INFERENCE SYSTEM
          </p>

          <div className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link
              to='/app'
              className={`${moduleButtonClass} bg-slate-950 text-white hover:bg-slate-700`}
            >
              FRAME MODULE
            </Link>

            <a
              href='#'
              className={`${moduleButtonClass} border border-slate-300 bg-white text-slate-700 hover:bg-slate-100`}
            >
              INFERENCE MODULE
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
