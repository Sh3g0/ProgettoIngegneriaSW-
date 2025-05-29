import React, { useEffect, useState } from "react";

type Offerta = {
  id: number;
  titolo_immobile: string;
  prezzo_offerto: number;
  tipo_offerta: string;
  stato: string;
};

export default function NotificheOfferteCliente() {
  const [offerte, setOfferte] = useState<Offerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [controproposta, setControproposta] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchOfferte = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:3001/api/getOfferteCliente", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Errore HTTP:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setOfferte(data);
      } catch (err) {
        console.error("Errore nel recupero delle offerte:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferte();
  }, []);

  const handleContropropostaChange = (id: number, value: string) => {
    setControproposta({ ...controproposta, [id]: value });
  };

  const inviaControproposta = async (idOfferta: number) => {
    const prezzo = controproposta[idOfferta];
    if (!prezzo || isNaN(prezzo)) {
      alert("Inserisci un importo valido.");
      return;
    }

    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3001/api/inviaContropropostaCliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_offerta: idOfferta,
          nuovo_prezzo: parseFloat(prezzo),
        }),
      });

      if (!res.ok) {
        throw new Error("Errore durante l'invio della controproposta.");
      }

      const data = await res.json();
      console.log("Controproposta inviata:", data);
      alert("Controproposta inviata correttamente.");

      setOfferte((prev) =>
        prev.map((offerta) =>
          offerta.id === idOfferta
            ? {
                ...offerta,
                stato: "in_attesa",
                prezzo_offerto: parseFloat(prezzo),
                tipo_offerta: "controfferta_cliente",
              }
            : offerta
        )
      );

      setControproposta({ ...controproposta, [idOfferta]: "" });
    } catch (error) {
      console.error(error);
      alert("Si è verificato un errore durante l'invio della controproposta.");
    }
  };

  if (loading) {
    return <p className="text-gray-500">Caricamento delle offerte in corso...</p>;
  }

  return (
    <div className="p-6">

      {offerte.length === 0 ? (
        <p className="text-gray-600 italic">Non risultano offerte inviate al momento.</p>
      ) : (
        offerte.map((offerta) => (
          <div
            key={offerta.id}
            className="border border-blue-200 p-6 rounded-2xl shadow-sm mb-6 bg-white"
          >
            <p className="text-gray-700 mb-2">
              <span className="font-medium text-blue-900">Immobile:</span> {offerta.titolo_immobile}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-medium text-blue-900">Prezzo Offerto:</span> €
              {offerta.prezzo_offerto}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-medium text-blue-900">Tipologia Offerta:</span>{" "}
              {offerta.tipo_offerta}
            </p>
            <p className="text-gray-700 mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-white text-sm ${
                  offerta.stato === "accettata"
                    ? "bg-green-600"
                    : offerta.stato === "rifiutata"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {offerta.stato === "in attesa"
                  ? "In attesa di risposta"
                  : offerta.stato.charAt(0).toUpperCase() + offerta.stato.slice(1)}
              </span>
            </p>

            {(offerta.stato === "in_attesa" || offerta.stato === "rifiutata") && (
              <div className="mt-4">
                <label className="block text-blue-900 font-medium mb-2">
                  Invia una controproposta (€)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-blue-300 rounded-lg mb-3"
                  placeholder="Inserisci un nuovo importo"
                  value={controproposta[offerta.id] || ""}
                  onChange={(e) => handleContropropostaChange(offerta.id, e.target.value)}
                />
                <button
                  onClick={() => inviaControproposta(offerta.id)}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Invia Controproposta
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
