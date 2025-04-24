import React from 'react';

export default function LogoConScrittaStorico() {
  return (
    <div className="flex items-center gap-4 p-4 ">
      <img
        src="/img/logo.png" 
        alt="Logo DietiEstates"
        className="w-20 h-20 object-contain w-20 h-20"
      />
      <h1 className="text-3xl font-extrabold text-[#061d33]">STORICO OFFERTE</h1>
    </div>
  );
}
