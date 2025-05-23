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

  useEffect(() => {
    console.log(id);
    const fetchBooks = async () => {
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

    fetchBooks();
  }, [id]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Il tuo storico</h2>
      
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
              <p><strong><a href={`/Immobile?id=${sto.id_immobile}`}>Clicca qui per visualizzare l'immobile</a></strong></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
