import { useFrameStore } from '../store/frameStore';

function HomePage() {
  const { frames, relations } = useFrameStore();

  const classCount = frames.filter((frame) => frame.type === 'CLASS').length;
  const objectCount = frames.filter((frame) => frame.type === 'OBJECT').length;

  const stats = [
    {
      label: 'Number of frames',
      value: frames.length,
    },
    {
      label: 'Number of relations',
      value: relations.length,
    },
    {
      label: 'Classes',
      value: classCount,
    },
    {
      label: 'Objects',
      value: objectCount,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Dashboard</h2>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Basic summary of the currently modeled frame system
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"
          >
            <h3 className="text-base font-semibold text-slate-700 sm:text-lg">
              {item.label}
            </h3>

            <p className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
