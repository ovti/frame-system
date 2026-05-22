import { Link } from 'react-router-dom';
import FloatingBackground from '../components/common/FloatingBackground';

function LandingPage() {
  const moduleButtonClass =
    'flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl px-5 text-center text-xs font-semibold uppercase tracking-wide shadow-sm transition hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-[0.98] sm:h-14 sm:w-56 sm:px-6 sm:text-sm';

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-6 sm:px-6 sm:py-8'>
      <FloatingBackground />

      <section className='relative z-10 flex min-h-[420px] w-full max-w-5xl items-center justify-center overflow-hidden rounded-3xl bg-white/90 px-5 py-14 text-center shadow-sm backdrop-blur-sm sm:min-h-[440px] sm:px-8 sm:py-16 md:min-h-[480px] md:px-12 md:py-20'>
        <img
          src='/images/main4.png'
          alt=''
          aria-hidden='true'
          className='pointer-events-none absolute left-1/2 top-1/2 z-0 h-[340px] w-[430px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.10] blur-[1px] sm:h-[430px] sm:w-[540px] md:h-[500px] md:w-[640px]'
        />

        <div className='relative z-10 w-full'>
          <h1 className='break-words text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl md:text-7xl'>
            GRAGRAFRAME
          </h1>

          <p className='mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:mt-6 sm:text-xl sm:leading-8 md:text-2xl'>
            GRAPH GRAMMAR-BASED
          </p>

          <p className='mx-auto mt-1 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:mt-2 sm:text-xl sm:leading-8 md:text-2xl'>
            FRAME INFERENCE SYSTEM
          </p>

          <div className='mx-auto mt-8 flex w-full max-w-sm flex-col items-center justify-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:gap-4'>
            <Link
              to='/app'
              className={`${moduleButtonClass} bg-slate-950 text-white hover:bg-slate-700`}
            >
              FRAME MODULE
            </Link>

            <a
              href='#'
              className={`${moduleButtonClass} border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100`}
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
