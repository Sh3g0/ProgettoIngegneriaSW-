import React from 'react';

export default function LogoConScritta() {
  return (
    <div className="flex items-center gap-4 ">
      <img
        src="/img/logo.png" 
        alt="Logo DietiEstates"
        className="w-20 h-20 object-contain w-60 h-60"
      />
      <h1 className="text-6xl font-extrabold text-[#061d33]">DIETIESTATES25</h1>
    </div>
  );
}
