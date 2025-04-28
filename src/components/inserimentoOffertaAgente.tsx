'use client';

import { useState } from 'react';

export default function InserimentoOffertaAgente() {
  const [formData, setFormData] = useState({
    immobile: '',
    cliente: '',
    offerta: '',
    nota: '',
  });

  const immobiliDisponibili: string[] = []; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Offerta inviata:", formData);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Inserisci una nuova offerta</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Immobile</label>
          <select
            name="immobile"
            value={formData.immobile}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Seleziona un immobile</option>
            {immobiliDisponibili.length === 0 ? (
              <option disabled>Nessun immobile disponibile</option>
            ) : (
              immobiliDisponibili.map((imm, index) => (
                <option key={index} value={imm}>{imm}</option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nome cliente</label>
          <input
            type="text"
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Offerta (€)</label>
          <input
            type="number"
            name="offerta"
            min="0"
            value={formData.offerta}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nota (opzionale)</label>
          <textarea
            name="nota"
            value={formData.nota}
            onChange={handleChange}
            rows={3}
            className="w-full border p-2 rounded"
            placeholder="Aggiungi eventuali note..."
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
          >
            Invia Offerta
          </button>
        </div>
      </form>
    </div>
  );
}
