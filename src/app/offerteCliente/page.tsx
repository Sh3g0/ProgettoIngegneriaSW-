'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; 
import LogoConScrittaOfferteCliente from '@/app/components/logoConScrittaOfferteCliente';
import TabellaOfferteCliente from '@/app/components/tabellaOfferteCliente'; 
import TendinaOfferteCliente from '@/app/components/tendinaOfferteCliente';
export default function OfferteCliente() {
  const router = useRouter();

  const handleVisualizzaPrenotazioni = () => {
    router.push('/prenotazioniCliente'); 
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaOfferteCliente />
      </div>

      <div className="flex-1 p-8">
        <LogoConScrittaOfferteCliente />

        <TabellaOfferteCliente />

        <div className="flex justify-center mt-8">
          <button 
            onClick={handleVisualizzaPrenotazioni} 
            className="bg-[#8B0000] hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-md">
            Visualizza visite prenotate
          </button>
        </div>
      </div>
    </div>
  );
}
