import { useFrameStore } from '../store/frameStore';

function HomePage() {
  const { frames, relations } = useFrameStore();

  const classCount = frames.filter((frame) => frame.type === 'CLASS').length;
  const objectCount = frames.filter((frame) => frame.type === 'OBJECT').length;

  return (
    <div>
      <h2 className='mb-4 text-3xl font-bold'>Dashboard</h2>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold'>Number of frames</h3>
          <p className='mt-2 text-3xl font-bold'>{frames.length}</p>
        </div>

        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold'>Number of relations</h3>
          <p className='mt-2 text-3xl font-bold'>{relations.length}</p>
        </div>

        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold'>Classes</h3>
          <p className='mt-2 text-3xl font-bold'>{classCount}</p>
        </div>

        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <h3 className='text-lg font-semibold'>Objects</h3>
          <p className='mt-2 text-3xl font-bold'>{objectCount}</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
