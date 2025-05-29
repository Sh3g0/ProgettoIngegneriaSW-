import { useEffect, useState } from "react";

export default function NotificheOfferte() {
  const [offerte, setOfferte] = useState([]);
  const [controproposte, setControproposte] = useState({});
  

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // o da dove salvi il token

    fetch("http://localhost:3001/api/offerteRicevuteAgente", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Dati ricevuti offerte:", data);
        setOfferte(data);
      })
      .catch(err => console.error("Errore nel caricamento offerte:", err));
  }, []);

  const aggiornaStatoOfferta = async (id_offerta: any, stato: any) => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3001/api/rispondi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id_offerta, stato })
      });

      const data = await res.json();
      setOfferte(prev => prev.filter(offerta => offerta.id !== id_offerta));
      alert(data.message);
    } catch (err) {
      console.error("Errore nella risposta all'offerta:", err);
    }
  };

  const inviaControproposta = async (id_offerta) => {
    const token = sessionStorage.getItem("token");

    const nuovoPrezzo = controproposte[id_offerta];
    if (!nuovoPrezzo) return alert("Inserisci un prezzo valido");

    try {
      const res = await fetch("http://localhost:3001/api/controproponi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // <<< AGGIUNGI QUESTO!
        },
        body: JSON.stringify({ id_offerta, nuovo_prezzo: nuovoPrezzo })
      });

      const data = await res.json();
      setOfferte(prev => prev.filter(offerta => offerta.id !== id_offerta));
      alert(data.message);
    } catch (err) {
      console.error("Errore nella controproposta:", err);
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Offerte Ricevute</h2>

      {offerte.length === 0 && (
        <p className="text-gray-600">Non ci sono offerte al momento.</p>
      )}

      {offerte.map((offerta) => (
        <div
          key={offerta.id}
          className="border border-blue-300 p-5 rounded-xl shadow-sm mb-5 bg-white"
        >
          <p className="text-gray-700"><strong>Immobile:</strong> {offerta.titolo_immobile}</p>
          <p className="text-gray-700"><strong>Cliente ID:</strong> {offerta.id_cliente}</p>
          <p className="text-gray-700"><strong>Prezzo Offerto:</strong> €{offerta.prezzo_offerto}</p>
          <p className="text-gray-700"><strong>Tipo Offerta:</strong> {offerta.tipo_offerta}</p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() => aggiornaStatoOfferta(offerta.id, "accettata")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Accetta
            </button>

            <button
              onClick={() => aggiornaStatoOfferta(offerta.id, "rifiutata")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Rifiuta
            </button>

            <input
              type="number"
              placeholder="Nuovo prezzo"
              value={controproposte[offerta.id] || ""}
              onChange={(e) =>
                setControproposte((prev) => ({
                  ...prev,
                  [offerta.id]: e.target.value,
                }))
              }
              className="border border-blue-300 px-3 py-2 rounded w-36 text-sm text-gray-700"
            />

            <button
              onClick={() => inviaControproposta(offerta.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Controproponi
            </button>
          </div>
        </div>
      ))}
    </div>

  );
}



