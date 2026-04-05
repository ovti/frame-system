function HomePage() {
  return (
    <div>
      <h2 className='mb-4 text-3xl font-bold'>Dashboard</h2>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold'>Liczba ramek</h3>
          <p className='mt-2 text-3xl font-bold'>0</p>
        </div>

        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold'>Liczba relacji</h3>
          <p className='mt-2 text-3xl font-bold'>0</p>
        </div>

        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold'>Typy ramek</h3>
          <p className='mt-2 text-3xl font-bold'>0</p>
        </div>

        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold'>Status eksportu</h3>
          <p className='mt-2 text-3xl font-bold'>Brak</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
