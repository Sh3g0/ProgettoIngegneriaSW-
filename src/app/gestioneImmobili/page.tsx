'use client';

import React, { useEffect, useState } from 'react';
import { useJwtPayload } from '@/components/useJwtPayload';
import Banner from '@/components/Banner';
import { useRouter } from 'next/navigation';

interface Immobile {
  id: number;
  id_agente: number;
  titolo: string;
  descrizione: string;
  prezzo: number;
  dimensione_mq: number;
  indirizzo: string;
  comune: string;
  citta: string;
  piano: number;
  stanze: number;
  ascensore: boolean;
  classe_energetica: string;
  portineria: boolean;
  climatizzazione: boolean;
  tipo_annuncio: string;
  latitudine: number;
  longitudine: number;
  vicino_scuole: boolean;
  vicino_parchi: boolean;
  vicino_trasporti: boolean;
  data: string;
  stato: string
  immagine_url?: string;
}

export default function GestioneImmobiliPage() {
  const payload = useJwtPayload();
  const router = useRouter();

  const [immobili, setImmobili] = useState<Immobile[]>([]);
  const [loading, setLoading] = useState(true);

    const [offertaApertaId, setOffertaApertaId] = useState<number | null>(null);
  const [offertaData, setOffertaData] = useState({
    tipo_richiesta: 'esterna',
    nome_cliente: '',
    email_cliente: '',
  });

  const apriFormOfferta = (id: number) => {
    setOffertaApertaId(id);
    setOffertaData({
      tipo_richiesta: 'esterna',
      nome_cliente: '',
      email_cliente: '',
    });
  };

  const chiudiFormOfferta = () => setOffertaApertaId(null);

  const handleOffertaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOffertaData({ ...offertaData, [e.target.name]: e.target.value });
  };

  const inviaOfferta = async (idImmobile: number) => {
    // TODO: metti qui la chiamata fetch per inviare l'offerta al backend
    try {
      const res = await fetch(`http://localhost:3001/api/inviaOfferta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ immobileId: idImmobile, ...offertaData }),
      });

      if (res.ok) {
        alert("Offerta inviata con successo!");
        chiudiFormOfferta();
      } else {
        const data = await res.json();
        alert("Errore: " + data.message);
      }
    } catch (error) {
      console.error("Errore invio offerta:", error);
      alert("Errore durante l'invio dell'offerta.");
    }
  };

  const fetchImmobili = async () => {
    if (!payload?.id) return;

    try {
      const res = await fetch(`http://localhost:3001/api/getImmobiliByAgente/${payload.id}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setImmobili(data);
      } else {
        console.error("La risposta non è un array:", data);
        setImmobili([]);
      }
    } catch (err) {
      console.error('Errore nel recupero immobili:', err);
      setImmobili([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImmobile = async (id: number) => {
    const conferma = window.confirm("Sei sicuro di voler eliminare questo immobile?");
    if (!conferma) return;

    try {
      const res = await fetch(`http://localhost:3001/api/eliminaImmobile/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchImmobili();
      } else {
        const result = await res.json();
        alert("Errore nell'eliminazione: " + result.message);
      }
    } catch (err) {
      console.error("Errore nell'eliminazione dell'immobile:", err);
      alert("Errore durante l'eliminazione dell'immobile.");
    }
  };

  useEffect(() => {
    fetchImmobili();
  }, [payload]);

return (
  <div className="min-h-screen bg-gray-100">
    <Banner />
    <main className="bg-white p-8 m-8 rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-blue-900 font-bold">I miei Immobili</h2>
        <button
          onClick={() => router.push('/caricaImmobile')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
        >
          + Nuovo Immobile
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Caricamento immobili...</p>
      ) : (
        <div className="grid gap-4">
          {immobili.length === 0 ? (
            <p className="text-gray-500">Nessun immobile trovato.</p>
          ) : (
            immobili.map((immobile) => (
              <div
                key={immobile.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm flex flex-col"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => router.push(`/Immobile?id=${immobile.id}`)}
                >
                  <div>
                    <p className="font-semibold text-blue-800">{immobile.titolo}</p>
                    <p className="text-sm text-gray-600">{immobile.indirizzo}, {immobile.citta}</p>
                    <p className="text-sm text-gray-500">€ {immobile.prezzo.toLocaleString()}</p>
                    <p className="text-sm font-medium mt-1">
                      Stato: <span className="capitalize">{immobile.stato || 'Non specificato'}</span>
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImmobile(immobile.id);
                    }}
                    className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                  >
                    Elimina
                  </button>
                </div>

                {offertaApertaId !== immobile.id ? (
                  <button
                    onClick={() => apriFormOfferta(immobile.id)}
                    className="mt-3 self-start bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Fai offerta
                  </button>
                ) : (
                  <form
                    className="mt-3 bg-white border p-3 rounded-md shadow-md"
                    onSubmit={(e) => {
                      e.preventDefault();
                      inviaOfferta(immobile.id);
                    }}
                  >
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Tipo di richiesta:</label>
                      <select
                        name="tipo_richiesta"
                        value={offertaData.tipo_richiesta}
                        onChange={handleOffertaChange}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="interna">Interna</option>
                        <option value="esterna">Esterna</option>
                      </select>
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Nome cliente:</label>
                      <input
                        type="text"
                        name="nome_cliente"
                        value={offertaData.nome_cliente}
                        onChange={handleOffertaChange}
                        required
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Email cliente:</label>
                      <input
                        type="email"
                        name="email_cliente"
                        value={offertaData.email_cliente}
                        onChange={handleOffertaChange}
                        required
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={chiudiFormOfferta}
                        className="px-3 py-1 border rounded hover:bg-gray-200"
                      >
                        Annulla
                      </button>

                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Invia
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </main>
  </div>
);

}
