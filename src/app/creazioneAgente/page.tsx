'use client';

import CreaAgente from "@/components/creaAgente";
import TendinaGestioneAgenti from "@/components/tendinaGestioneAgenti";

export default function CreazioneAgente() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaGestioneAgenti />
      </div>

      <div className="flex-1 p-6 md:p-10 space-y-10">
       <CreaAgente/>
      </div>
    </div>
  );
}
