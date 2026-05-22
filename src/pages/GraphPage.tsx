import GraphCanvas from '../components/graph/GraphCanvas';

function GraphPage() {
  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold sm:text-3xl'>Graph</h2>

        <p className='mt-1 max-w-3xl text-sm text-slate-500 sm:text-base'>
          Visualization of the created frame system and relations between frames
        </p>

        <p className='mt-2 text-xs text-slate-400 sm:hidden'>
          You can drag, zoom and move the graph to inspect the structure.
        </p>
      </div>

      <GraphCanvas />
    </div>
  );
}

export default GraphPage;
