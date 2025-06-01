import React, { useState, useEffect } from "react";

interface DashboardProps {
  id: string;
}

interface Storico {
  id: string;
  id_utente: string;
  id_immobile: string;
  tipo_attivita: string;
  data_attivita: string;
}

export default function Storico({ id }: DashboardProps) {
  const [storici, setStorici] = useState<Storico[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStorico = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/getUserStorico`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Errore nella risposta HTTP');

      const storici = await response.json();
      setStorici(storici);
    } catch (error) {
      console.error("Errore durante il recupero dello storico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorico();
    console.log("storici: ",storici)
  }, [id]);

  const handleRemoveAll = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare tutto lo storico?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/cleanStorico/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error("Errore durante l'eliminazione dello storico");
      setStorici([]);
    } catch (error) {
      console.error("Errore nella rimozione dello storico:", error);
    }
  };

  const handleRemoveItem = async (idStorico: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/removeStorico/${idStorico}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error("Errore nella rimozione attività");

      setStorici((prev) => prev.filter(item => item.id !== idStorico));
    } catch (error) {
      console.error("Errore durante la rimozione dell'attività:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Il tuo storico</h2>

      <button
        onClick={handleRemoveAll}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Elimina tutto lo storico
      </button>

      {loading ? (
        <p>Caricamento...</p>
      ) : storici.length === 0 ? (
        <p>Nessun dato trovato.</p>
      ) : (
        <ul className="space-y-2">
          {storici.map((sto) => (
            <li key={sto.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <p><strong>Attività:</strong> {sto.tipo_attivita}</p>
              <p><strong>Data:</strong> {new Date(sto.data_attivita).toLocaleString()}</p>
              <p><strong><a href={`/Immobile?id=${sto.id_immobile}`} className="text-blue-600 hover:underline">Clicca qui per visualizzare l'immobile</a></strong></p>
              <button
                onClick={() => handleRemoveItem(sto.id)}
                className="mt-2 px-3 py-1 text-sm bg-red-400 text-white rounded hover:bg-red-600"
              >
                Elimina questa attività
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
