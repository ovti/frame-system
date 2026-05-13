import { Link } from 'react-router-dom';

const functionalities = [
  {
    title: 'Dashboard',
    description:
      'A basic summary of the current graph, including the number of frames, relations, classes, and objects.',
    path: '/app/dashboard',
  },
  {
    title: 'Graph visualization',
    description:
      'A graphical view of the created frame system and its relations represented as a graph.',
    path: '/app/graph',
  },
  {
    title: 'Frame creation',
    description:
      'Adding frames that represent objects or classes, including slots, aspects, and demons.',
    path: '/app/frames',
  },
  {
    title: 'Relation creation',
    description:
      'Defining connections between frames using selected relation sets, such as family relations.',
    path: '/app/relations',
  },
  {
    title: 'IE graph export',
    description:
      'Exporting the created graph to a JSON text representation based on the IE graph model.',
    path: '/app/export',
  },
];

function ModuleFunctionalitiesPage() {
  return (
    <div>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-slate-950'>
          Module functionalities
        </h2>

        <p className='mt-2 max-w-3xl text-slate-500'>
          This part of the application provides tools for creating a frame
          system, defining relations between frames, visualizing the graph, and
          exporting the result to an IE graph representation.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {functionalities.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className='group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
          >
            <h3 className='text-xl font-bold text-slate-900 transition group-hover:text-slate-700'>
              {item.title}
            </h3>

            <p className='mt-3 text-sm leading-6 text-slate-500'>
              {item.description}
            </p>

            <p className='mt-5 text-sm font-semibold text-slate-900'>
              Go to section →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ModuleFunctionalitiesPage;
