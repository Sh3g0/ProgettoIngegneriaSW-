'use client';

export default function TabellaOfferteCliente() {
  const offerte = [
    {
      immobile: 'Via Roma 12, Napoli',
      proposta: '€150.000',
      stato: 'In attesa',
    },
    {
      immobile: 'Corso Umberto I, Napoli',
      proposta: '€220.000',
      stato: 'Accettata',
    },
    {
      immobile: 'Via Toledo 55, Napoli',
      proposta: '€180.000',
      stato: 'Rifiutata',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full text-left border-t border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 font-semibold text-gray-700">Immobile</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Proposta di acquisto</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Stato offerta</th>
          </tr>
        </thead>
        <tbody>
          {offerte.map((offerta, i) => (
            <tr key={i} className="border-t">
              <td className="px-6 py-4">{offerta.immobile}</td>
              <td className="px-6 py-4">{offerta.proposta}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    offerta.stato === 'Accettata'
                      ? 'bg-green-500'
                      : offerta.stato === 'Rifiutata'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                >
                  {offerta.stato}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
