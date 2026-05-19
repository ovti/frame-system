import GraphCanvas from '../components/graph/GraphCanvas';

function GraphPage() {
  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-3xl font-bold'>Graph</h2>
        <p className='mt-1 text-slate-500'>
          Visualization of the created frame system and relations between frames
        </p>
      </div>

      <GraphCanvas />
    </div>
  );
}

export default GraphPage;
