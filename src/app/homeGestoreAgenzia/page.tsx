'use client';

import AnalisiGeneralePerGestore from "@/components/analisiGeneralePerGestore";
import AttivitaRecentiAgenti from "@/components/attivitàRecentiAgenti";
import TendinaHomeGestoreAgenzia from "@/components/tendinaHomeGestoreAgenzia";

export default function HomeGestoreAgenzia() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaHomeGestoreAgenzia />
      </div>

      <div className="flex-1 p-6 md:p-10 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Analisi Generale</h2>
          <AnalisiGeneralePerGestore />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Attività Recenti degli Agenti</h2>
          <AttivitaRecentiAgenti />
        </section>
      </div>
    </div>
  );
}
