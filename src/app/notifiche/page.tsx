'use client';
import { useJwtPayload } from '@/components/useJwtPayload';
import Notifiche from '@/components/notifiche';
import CalendarioAppuntamenti from '@/components/calendarioAppuntamenti';
import Banner from '@/components/Banner';

export default function NotifichePage() {
  const userInfo = useJwtPayload();

  if (!userInfo) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-gray-600">Caricamento dati utente...</div>
    </div>
  );

  return (
  <div className="relative">
  {/* Banner fissato in alto */}
  <div className="fixed top-0 left-0 right-0 z-50">
    <Banner />
  </div>

  {/* Contenuto principale */}
  <div className="container mx-auto px-4 pt-24 pb-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Appuntamenti</h1>
    
    {/* Box Notifiche con sfumatura blu */}
    <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 mb-12 shadow-md">
      <div className="bg-white rounded-[15px] overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Notifiche Recenti</h2>
          <p className="text-sm text-gray-500">Nuove richieste di appuntamento</p>
        </div>
        <div className="h-[500px] overflow-y-auto">
          <Notifiche agenteId={userInfo.id} />
        </div>
      </div>
    </div>

    {/* Box Calendario con sfumatura blu */}
    <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 shadow-md">
      <div className="bg-white rounded-[15px] p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Calendario Appuntamenti</h2>
          <p className="text-sm text-gray-500">Visualizza e gestisci il tuo programma</p>
        </div>
        <CalendarioAppuntamenti idAgente={userInfo.id} />
      </div>
    </div>
  </div>
</div>


  );
}