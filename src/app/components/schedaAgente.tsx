'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  nome: string;
  ruolo: string;
  email: string;
  telefono: string;
  partitaIVA: string;
  venduti: number;
  portafoglio: number;
  fatturato: number;
  foto: string;
}

export default function SchedaAgente({
  nome,
  ruolo,
  email,
  telefono,
  partitaIVA,
  venduti,
  portafoglio,
  fatturato,
  foto,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleModifica = () => {
    router.push('/modificaAgente');
  };

  const handleElimina = () => {
    setShowModal(true);
  };

  const confermaEliminazione = async () => {
    setShowModal(false);
    try {
      alert('Agente eliminato con successo!');
    } catch (err) {
      alert("Errore durante l'eliminazione dell'agente.");
    }
  };

  const annullaEliminazione = () => {
    setShowModal(false);
  };

  const handleCrea = () => {
    router.push('/creazioneAgente');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="flex items-center justify-between w-full">
        <div className="text-blue-600 font-semibold bg-blue-100 px-4 py-2 rounded">
          AGENTI TOTALI: 1/14
        </div>
      </div>

      <div className="bg-blue-100 rounded-xl p-6 w-full max-w-4xl flex flex-col items-center">
        <div className="relative mb-4">
          <Image
            src={foto}
            alt="Foto agente"
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-md"
          />
        </div>

        <div className="text-center">
          <h2 className="font-bold text-lg">{nome}</h2>
          <p className="text-sm text-gray-600">{ruolo}</p>
        </div>

        <button
          onClick={handleModifica}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          MODIFICA PROFILO
        </button>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div>
            <label className="block text-sm text-gray-600">EMAIL</label>
            <input
              type="text"
              value={email}
              readOnly
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">NUMERO DI TELEFONO</label>
            <input
              type="text"
              value={telefono}
              readOnly
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">PARTITA IVA</label>
            <input
              type="text"
              value={partitaIVA}
              readOnly
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 w-full text-center">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">IMMOBILI VENDUTI</p>
            <p className="text-xl font-bold">{venduti}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">IMMOBILI PORTAFOGLIO</p>
            <p className="text-xl font-bold">{portafoglio}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">FATTURATO TOTALE</p>
            <p className="text-xl font-bold">{fatturato.toLocaleString()} $</p>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button onClick={handleCrea} className="border px-4 py-2 rounded">
            CREA AGENTE
          </button>
          <button
            onClick={handleElimina}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            ELIMINA AGENTE
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-center">Conferma Eliminazione</h2>
            <p className="text-gray-700 text-center">
              Sei sicuro di voler eliminare l'agente <strong>{nome}</strong>?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={confermaEliminazione}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Sì, elimina
              </button>
              <button
                onClick={annullaEliminazione}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
