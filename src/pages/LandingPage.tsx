import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-slate-50 px-6'>
      <section className='w-full max-w-4xl rounded-3xl bg-white px-8 py-16 text-center shadow-sm'>
        <p className='mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400'>
          Praca magisterska
        </p>

        <h1 className='text-5xl font-bold tracking-tight text-slate-950 md:text-7xl'>
          FRAME SYSTEM
        </h1>

        <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600'>
          [placeholder]
        </p>

        <div className='mt-10 flex flex-col justify-center gap-4 sm:flex-row'>
          <Link
            to='/app'
            className='rounded-2xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-700'
          >
            Przejdź do aplikacji
          </Link>

          <a
            href='#'
            className='rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100'
          >
            Moduł Michał Bożek (w przygotowaniu)
          </a>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
