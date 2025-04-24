'use client';

export default function TabellaPrenotazioniCliente() {
  const prenotazioni = [
    {
      immobile: 'Via Roma 45, Napoli',
      fasciaOraria: '10:00 - 11:00',
      giorno: '20/04/2025',
      stato: 'Confermata',
    },
    {
      immobile: 'Corso Umberto 20, Napoli',
      fasciaOraria: '14:00 - 15:00',
      giorno: '22/04/2025',
      stato: 'In attesa',
    },
    {
      immobile: 'Via Toledo 100, Napoli',
      fasciaOraria: '16:30 - 17:30',
      giorno: '25/04/2025',
      stato: 'Annullata',
    },
  ];

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Immobile</th>
            <th className="px-6 py-3">Fascia oraria</th>
            <th className="px-6 py-3">Giorno</th>
            <th className="px-6 py-3">Stato prenotazione</th>
          </tr>
        </thead>
        <tbody>
          {prenotazioni.map((p, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{p.immobile}</td>
              <td className="px-6 py-4">{p.fasciaOraria}</td>
              <td className="px-6 py-4">{p.giorno}</td>
              <td className={`px-6 py-4 font-medium ${
                p.stato === 'Confermata' ? 'text-green-600' :
                p.stato === 'Annullata' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {p.stato}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
