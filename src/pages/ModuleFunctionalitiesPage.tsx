import { Link } from 'react-router-dom';

const functionalities = [
  {
    title: 'Dashboard',
    description:
      'Podstawowe podsumowanie aktualnego grafu, liczby ramek, relacji, klas i obiektów.',
    path: '/app/dashboard',
  },
  {
    title: 'Wizualizacja grafu',
    description:
      'Widok graficzny utworzonego systemu ramek i relacji w postaci grafu.',
    path: '/app/graph',
  },
  {
    title: 'Tworzenie ramek',
    description:
      'Dodawanie ramek reprezentujących obiekty lub klasy wraz z klatkami, aspektami i demonami.',
    path: '/app/frames',
  },
  {
    title: 'Tworzenie relacji',
    description:
      'Definiowanie połączeń między ramkami z wykorzystaniem wybranych zestawów relacji, np. więzi rodzinnych.',
    path: '/app/relations',
  },
  {
    title: 'Eksport IE graph',
    description:
      'Eksport utworzonego grafu do tekstowej reprezentacji JSON zgodnej z ideą grafu IE.',
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
          W tej części aplikacji dostępne są funkcje umożliwiające tworzenie
          systemu ramowego, definiowanie relacji między ramkami, wizualizację
          grafu oraz eksport wyniku do reprezentacji IE graph.
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
              Przejdź →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ModuleFunctionalitiesPage;
