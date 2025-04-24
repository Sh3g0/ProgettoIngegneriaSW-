'use client';

import { useState } from 'react';

interface AgentData {
  nome: string;
  cognome: string;
  email: string;
  password: string;
  telefono: string;
  partitaIVA: string;
  azienda: string;
  indirizzo: string;
  foto: string;
}

export default function CreaAgente() {
  const [newAgent, setNewAgent] = useState<AgentData>({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    telefono: '',
    partitaIVA: '',
    azienda: '',
    indirizzo: '',
    foto: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAgent({ ...newAgent, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAgent({ ...newAgent, foto: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSubmit = () => {
    console.log('Agente creato', newAgent);
    alert('Agente creato con successo!');
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Crea Nuovo Agente</h2>

      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Nome</label>
            <input
              type="text"
              name="nome"
              value={newAgent.nome}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Cognome</label>
            <input
              type="text"
              name="cognome"
              value={newAgent.cognome}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={newAgent.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={newAgent.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Numero di Telefono</label>
          <input
            type="text"
            name="telefono"
            value={newAgent.telefono}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Partita IVA</label>
          <input
            type="text"
            name="partitaIVA"
            value={newAgent.partitaIVA}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Nome Azienda</label>
          <input
            type="text"
            name="azienda"
            value={newAgent.azienda}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Indirizzo</label>
          <input
            type="text"
            name="indirizzo"
            value={newAgent.indirizzo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Carica Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Conferma Creazione
          </button>
        </div>
      </form>
    </div>
  );
}
