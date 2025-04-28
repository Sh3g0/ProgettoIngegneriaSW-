'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type BarraRicercaHomeAgenteProps = {
  onSearch: (termine: string) => void;
};

export default function BarraDiRicercaHomeAgente({ onSearch }: BarraRicercaHomeAgenteProps) {
  const [termine, setTermine] = useState('');
  const router = useRouter(); 

  const handleCaricaIMM = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    router.push('/caricaImmobile'); 
  };

  return (
    <form className="flex items-center w-full max-w-xl mx-auto p-2 bg-white rounded-full shadow-md">
      <input
        type="text"
        placeholder="Inserisci l'indirizzo dell'immobile 🔍"
        className="flex-grow px-4 py-2 text-gray-800 rounded-l-full focus:outline-none"
        value={termine}
        onChange={(e) => setTermine(e.target.value)}
      />
      <button onClick={handleCaricaIMM} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-full">
        CARICA
      </button>
    </form>
  );
}
