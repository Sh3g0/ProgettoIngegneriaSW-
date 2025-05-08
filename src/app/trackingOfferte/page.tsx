'use client'
import InserimentoOffertaAgente from "../registrazione/inserimentoOffertaAgente";
import LogoConScrittaTracking from "../registrazione/logoConScrittaTracking";
import TendinaLateraleTracking from "../registrazione/tendinaLateraleTracking";
import TrackingOfferteAgente from "../registrazione/trackingOfferteAgente";
import { useRouter } from 'next/navigation';


export default function TrackingOfferte() {
  const router = useRouter();
  const handleStoricoAgente = () => {
    router.push('/storicoAgente'); 
  };


  return (
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaLateraleTracking />
      </div>

      <div className="flex-1 p-8">
        <LogoConScrittaTracking />

        <div className="flex flex-wrap gap-8 mt-8">
          <div className="flex-1 min-w-[400px]">
            <TrackingOfferteAgente />

            <div className="mt-6">
              <button onClick={handleStoricoAgente}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow">
                Visualizza Storico
              </button>
            </div>
          </div>

          <div className="w-full md:w-[400px]">
            <InserimentoOffertaAgente />
          </div>
        </div>
      </div>
    </div>
  );
}
