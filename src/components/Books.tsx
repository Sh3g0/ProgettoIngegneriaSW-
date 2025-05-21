import React, { useState, useEffect } from "react";

interface DashboardProps {
  id: string;
}

interface Prenotazione {
  id: string;
  id_utente: string;
  id_immobile: string;
  tipo_attivita: string;
  data_attivita: string;
}

export default function Books({ id }: DashboardProps) {
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/getUserBooks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Errore nella risposta HTTP');

        const books = await response.json();
        setPrenotazioni(books);
      } catch (error) {
        console.error("Errore durante il recupero delle prenotazioni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [id]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Le tue prenotazioni</h2>
      
      {loading ? (
        <p>Caricamento...</p>
      ) : prenotazioni.length === 0 ? (
        <p>Nessuna prenotazione trovata.</p>
      ) : (
        <ul className="space-y-2">
          {prenotazioni.map((pren) => (
            <li key={pren.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <p><strong>Attività:</strong> {pren.tipo_attivita}</p>
              <p><strong>Data:</strong> {new Date(pren.data_attivita).toLocaleString()}</p>
              <p><strong>ID Immobile:</strong> {pren.id_immobile}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
