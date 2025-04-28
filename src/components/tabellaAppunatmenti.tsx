import React from "react";

interface Appuntamento {
  orario: string;
  cliente: string;
  immobile: string;
  dataOfferta: string;
  statoRichiesta: string;
}

const appuntamenti: Appuntamento[] = [
  {
    orario: "10:00",
    cliente: "Mario Rossi",
    immobile: "Appartamento A",
    dataOfferta: "2025-04-15",
    statoRichiesta: "In attesa",
  },
  {
    orario: "12:00",
    cliente: "Giulia Bianchi",
    immobile: "Villa X",
    dataOfferta: "2025-04-14",
    statoRichiesta: "Accettata",
  },
  {
    orario: "14:30",
    cliente: "Luca Verdi",
    immobile: "Appartamento B",
    dataOfferta: "2025-04-13",
    statoRichiesta: "Rifiutata",
  },
];

const TabellaAppuntamenti: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-4 border-b text-left">Orario</th>
            <th className="py-2 px-4 border-b text-left">Cliente</th>
            <th className="py-2 px-4 border-b text-left">Immobile</th>
            <th className="py-2 px-4 border-b text-left">Data Offerta</th>
            <th className="py-2 px-4 border-b text-left">Stato Richiesta</th>
          </tr>
        </thead>
        <tbody>
          {appuntamenti.map((appuntamento, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">{appuntamento.orario}</td>
              <td className="py-2 px-4">{appuntamento.cliente}</td>
              <td className="py-2 px-4">{appuntamento.immobile}</td>
              <td className="py-2 px-4">{appuntamento.dataOfferta}</td>
              <td className="py-2 px-4">{appuntamento.statoRichiesta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabellaAppuntamenti;
