'use client';

import React, { useState } from 'react';
import Banner from '@/components/Banner';

export default function GestioneAdminPage() {
  const [adminList, setAdminList] = useState<any[]>([]); // opzionale se vuoi visualizzare admin esistenti
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleAddAdmin = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          ruolo: 'admin',
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Amministratore creato con successo!');
        setShowModal(false);
        setFormData({ email: '', username: '', password: '' });
      } else {
        alert('Errore nella creazione: ' + result.message);
      }
    } catch (err) {
      console.error('Errore creazione admin:', err);
      alert('Errore durante la creazione dell\'amministratore.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Banner />
      <main className="bg-white p-8 m-8 rounded-3xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-blue-900 font-bold">Gestione Amministratori</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            + Nuovo Amministratore
          </button>
        </div>

        {/* MODALE NUOVO ADMIN */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
              <h3 className="text-xl font-bold mb-4 text-blue-800">Crea Nuovo Amministratore</h3>

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
                  onClick={handleAddAdmin}
                >
                  Crea
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
