'use client';

import TendinaHomeGestoreAgenzia from "@/components/tendinaHomeGestoreAgenzia";
import AttivitaRecentiAgentiCompleta from "@/components/attivitaRecentiAgentiCompleta";

export default function AttivitaRecentiCompleta() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaHomeGestoreAgenzia />
      </div>

      <div className="flex-1 p-6 md:p-10 space-y-10">
        <AttivitaRecentiAgentiCompleta />
      </div>
    </div>
  );
}
