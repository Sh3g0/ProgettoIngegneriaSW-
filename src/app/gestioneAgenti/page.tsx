'use client';

import SchedaAgente from "@/components/schedaAgente";
import TendinaGestioneAgenti from "@/components/tendinaGestioneAgenti";

export default function GestioneAgenti() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaGestioneAgenti />
      </div>

      <div className="flex-1 p-6 md:p-10 space-y-10">
        <SchedaAgente
          nome="Dr. Olivia Turner, M.D."
          ruolo="SPACCIATRICE DI EROINA"
          email="olivia.turner@gmail.com"
          telefono="33948524954"
          partitaIVA="12345678"
          venduti={4}
          portafoglio={15}
          fatturato={100000}
          foto="/img/olivia.png" 
        />
      </div>
    </div>
  );
}
