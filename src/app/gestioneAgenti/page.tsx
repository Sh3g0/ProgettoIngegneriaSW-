'use client';

import React, { useEffect, useState } from 'react';
import { useJwtPayload } from '@/components/useJwtPayload';
import Banner from '@/components/Banner';

export default function GestioneAgentiPage() {
  const payload = useJwtPayload();
  type Agente = {
    id: string;
    email: string;
    username: string;
    ruolo: string;
    id_agenzia: string;
  };

  const [agenti, setAgenti] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    const fetchAgenti = async () => {
      if (!payload?.id) return;

      try {
        const res = await fetch(`http://localhost:3001/api/getAgentiByAgenzia/${payload.id}`);
        const data = await res.json();
        setAgenti(data || []);
      } catch (err) {
        console.error('Errore nel recupero agenti:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenti();
  }, [payload]);

  const handleAddAgente = async () => {
    try {
      console.log("Payload agenzia", payload)
      const res = await fetch('http://localhost:3001/api/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          ruolo: "agente",
          idAgenzia: payload?.id,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setAgenti(prev => [...prev, result.nuovoAgente]);
        setShowModal(false);
        setFormData({ email: '', username: '', password: '' });
      } else {
        alert('Errore nella creazione: ' + result.message);
      }
    } catch (err) {
      console.error('Errore creazione agente:', err);
      alert('Errore durante la creazione dell\'agente');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Banner />
      <main className="bg-white p-8 m-8 rounded-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-blue-900 font-bold">Agenti dell’Agenzia</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            + Nuovo Agente
          </button>
        </div>

        {loading ? (       
          <p className="text-gray-500">Caricamento agenti...</p>
        ) : (
          <div className="grid gap-4">
            {agenti.length === 0 ? (
              <p className="text-gray-500">Nessun agente trovato.</p>
            ) : (
              agenti.map((agente: any) => (
                <div
                  key={agente.id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm"
                >
                  <p className="font-semibold text-blue-800">{agente.username}</p>
                  <p className="text-sm text-gray-600">{agente.email}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* MODALE NUOVO AGENTE */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Crea Nuovo Agente</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Annulla
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleAddAgente}
              >
                Crea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
