'use client';
import { useRouter } from 'next/navigation';  
import LogoConScrittaPrenotazioniCliente from '@/app/components/logoConScrittaPrenotazioniCliente';
import TabellaPrenotazioniCliente from '@/app/components/tabellaPrenotazioniCliente';
import TendinaOfferteCliente from '@/app/components/tendinaOfferteCliente';
export default function PrenotazioniCliente() {
  const router = useRouter();

  const handleVisualizzaOfferte = () => {
    router.push('/offerteCliente'); 
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaOfferteCliente />
      </div>

      <div className="flex-1 p-8">
        <LogoConScrittaPrenotazioniCliente />

        <TabellaPrenotazioniCliente />
        
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleVisualizzaOfferte}
            className="bg-[#8B0000] hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-md">
            Visualizza le tue offerte
          </button>
        </div>
      </div>
    </div>
  );
}
