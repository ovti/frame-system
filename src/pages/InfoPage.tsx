function InfoPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-950">Info</h2>
        <p className="mt-1 text-slate-500">Information about the application</p>
      </div>

      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="max-w-4xl text-lg leading-8 text-slate-700">
          Autorem niniejszego serwisu jest Miłosz Załubski-Gabis.
        </p>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
          Serwis ten stanowi integralną część pracy magisterskiej, kierunek:
          elektroniczne przetwarzanie informacji, przygotowanej pod kierunkiem
          Prof. dr hab. Mariusza Flasińskiego na Wydziale Zarządzania i
          Komunikacji Społecznej Uniwersytetu Jagiellońskiego.
        </p>
      </section>
    </div>
  );
}

export default InfoPage;
