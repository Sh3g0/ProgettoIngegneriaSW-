'use client';

import React, { useEffect, useState } from 'react';
import { useJwtPayload } from '@/components/useJwtPayload';
import Banner from '@/components/Banner';

export default function GestioneRichiestePage() {
  const payload = useJwtPayload();

  type Immobile = {
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
  };

  type Agenzia = {
    id: number;
    nome: string;
    sede: string;
    email: string;
    descrizione: string;
  };

  const [immobili, setImmobili] = useState<Immobile[]>([]);
  const [agenzie, setAgenzie] = useState<Agenzia[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<Immobile | Agenzia | null>(null);
  const [itemType, setItemType] = useState<'immobile' | 'agenzia' | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRichieste();
  }, []);

  const fetchRichieste = async () => {
    try {
      const [immobiliRes, agenzieRes] = await Promise.all([
        fetch('http://localhost:3001/api/richieste/immobili'),
        fetch('http://localhost:3001/api/richieste/agenzie'),
      ]);

      const [immobiliData, agenzieData] = await Promise.all([
        immobiliRes.json(),
        agenzieRes.json(),
      ]);

      setImmobili(immobiliData);
      setAgenzie(agenzieData);
    } catch (err) {
      console.error('Errore nel caricamento delle richieste:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccetta = async (type: 'immobile' | 'agenzia', id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/richieste/${type}/accetta/${id}`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchRichieste();
        setShowModal(false);
      } else {
        const result = await res.json();
        alert(`Errore nell'accettare la richiesta: ${result.message}`);
      }
    } catch (err) {
      console.error('Errore accettazione:', err);
      alert('Errore durante accettazione richiesta.');
    }
  };

  const handleRifiuta = async (type: 'immobile' | 'agenzia', id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/richieste/${type}/rifiuta/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchRichieste();
        setShowModal(false);
      } else {
        const result = await res.json();
        alert(`Errore nel rifiutare la richiesta: ${result.message}`);
      }
    } catch (err) {
      console.error('Errore rifiuto:', err);
      alert('Errore durante rifiuto richiesta.');
    }
  };

  const openModal = (item: Immobile | Agenzia, type: 'immobile' | 'agenzia') => {
    setSelectedItem(item);
    setItemType(type);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Banner />
      <main className="bg-white p-8 m-8 rounded-3xl shadow-lg">
        <h2 className="text-2xl text-blue-900 font-bold mb-6">Richieste da Gestire</h2>

        {loading ? (
          <p className="text-gray-500">Caricamento richieste...</p>
        ) : (
          <>
            {/* IMMOBILI */}
            <h3 className="text-xl font-semibold text-blue-800 mt-6 mb-2">Richieste Immobili</h3>
            <div className="space-y-3">
              {immobili.map((immobile) => (
                <div
                  key={immobile.id}
                  className="p-4 bg-gray-50 border rounded-xl flex justify-between items-center"
                >
                  <div>
                    <p
                      className="font-bold text-blue-700 hover:underline cursor-pointer"
                      onClick={() => openModal(immobile, 'immobile')}
                    >
                      {immobile.titolo}
                    </p>
                    <p className="text-sm text-gray-600">{immobile.citta} - €{immobile.prezzo}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AGENZIE */}
            <h3 className="text-xl font-semibold text-blue-800 mt-8 mb-2">Richieste Agenzie</h3>
            <div className="space-y-3">
              {agenzie.map((agenzia) => (
                <div
                  key={agenzia.id}
                  className="p-4 bg-gray-50 border rounded-xl flex justify-between items-center"
                >
                  <div>
                    <p
                      className="font-bold text-blue-700 hover:underline cursor-pointer"
                      onClick={() => openModal(agenzia, 'agenzia')}
                    >
                      {agenzia.nome}
                    </p>
                    <p className="text-sm text-gray-600">{agenzia.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MODALE DETTAGLI */}
        {showModal && selectedItem && itemType && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl max-w-lg w-full shadow-2xl">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Dettagli Richiesta</h3>

              {itemType === 'immobile' ? (
                <>
                  <p><strong>Titolo:</strong> {(selectedItem as Immobile).titolo}</p>
                  <p><strong>Descrizione:</strong> {(selectedItem as Immobile).descrizione}</p>
                  <p><strong>Prezzo:</strong> €{(selectedItem as Immobile).prezzo}</p>
                  <p><strong>Indirizzo:</strong> {(selectedItem as Immobile).indirizzo}</p>
                  <p><strong>Stanze:</strong> {(selectedItem as Immobile).stanze}</p>
                </>
              ) : (
                <>
                  <p><strong>Nome Agenzia:</strong> {(selectedItem as Agenzia).nome}</p>
                  <p><strong>Sede:</strong> {(selectedItem as Agenzia).sede}</p>
                  <p><strong>Email:</strong> {(selectedItem as Agenzia).email}</p>
                  <p><strong>Descrizione:</strong> {(selectedItem as Agenzia).descrizione}</p>
                </>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Chiudi
                </button>
                <button
                  onClick={() => handleRifiuta(itemType, selectedItem.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Rifiuta
                </button>
                <button
                  onClick={() => handleAccetta(itemType, selectedItem.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Accetta
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
