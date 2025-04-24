'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DettagliImmobile() {
  const router = useRouter();
  const [descrizione, setDescrizione] = useState('');
  const [tipologia, setTipologia] = useState('');
  const [contratto, setContratto] = useState('');
  const [foto, setFoto] = useState([]);

  const handleAvanti = () => {
    console.log("Descrizione:", descrizione);
    console.log("Tipologia:", tipologia);
    console.log("Contratto:", contratto);
    console.log("Foto caricate:", foto);
    router.push('/caricaImmobile3');
  };

  const handleIndietro = () => {
    router.push("/caricaImmobile");
  };

  const handleFotoChange = (e) => {
    setFoto([...e.target.files]);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 p-8 gap-6">
      {/* Sezione Sinistra */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
        <div>
          <label className="block text-gray-700 mb-2 text-lg font-semibold">Descrizione</label>
          <textarea
            rows="10"
            placeholder="Scrivi qui la descrizione dell'immobile..."
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            className="w-full px-4 py-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleIndietro}
            className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
          >
            ⬅ Indietro
          </button>
          <button
            onClick={handleAvanti}
            className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Avanti ➡
          </button>
        </div>
      </div>

      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-gray-700 mb-2 text-lg font-semibold">Tipologia immobile</label>
          <select
            value={tipologia}
            onChange={(e) => setTipologia(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleziona una tipologia</option>
            <option value="appartamento">Appartamento</option>
            <option value="attico">Attico</option>
            <option value="rudere">Rudere</option>
            <option value="villa">Villa</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-lg font-semibold">Tipologia contratto</label>
          <select
            value={contratto}
            onChange={(e) => setContratto(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleziona un contratto</option>
            <option value="affitto">Affitto</option>
            <option value="vendita">Vendita</option>
            <option value="affitto breve">Affitto breve</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-lg font-semibold">Carica foto dell'immobile</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFotoChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
