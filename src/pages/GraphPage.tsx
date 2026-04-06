import GraphCanvas from '../components/graph/GraphCanvas';

function GraphPage() {
  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-3xl font-bold'>Graf</h2>
        <p className='mt-1 text-slate-500'>
          Wizualizacja ramek i relacji w postaci grafu
        </p>
      </div>

      <GraphCanvas />
    </div>
  );
}

export default GraphPage;
