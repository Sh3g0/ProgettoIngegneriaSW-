'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJwtPayload } from '@/components/useJwtPayload';
import Banner from '@/components/Banner';
import { Profile } from '@/components/Profile';
import Books from '@/components/Books';

export default function UserProfile() {
  const router = useRouter();
  const payload = useJwtPayload();
  const [selectedMenu, setSelectedMenu] = useState('Profilo'); // valore iniziale

  useEffect(() => {
    console.log('Payload:', payload);

    if (payload === null) {
      // ancora loading o non presente, attendi
      return;
    }

  }, [payload, router]);

  if (payload === null) {
    return <div className="p-6">Caricamento profilo...</div>;
  }

  const id = payload.id;

  // Componenti finti per contenuti menu
  const renderContent = () => {
    switch(selectedMenu) {
      case 'Profilo':
        return <Profile/>
      case 'Notifiche':
        return <div>Qui ci sono le tue Notifiche.</div>;
      case 'Storico':
        return <Books id={id}/>
      case 'Appuntamenti':
        return <div>Qui puoi vedere gli Appuntamenti.</div>;
      case 'Logout':
        sessionStorage.removeItem('token');
        router.push('/home');
        return <div>Logout in corso...</div>
    }
  }

  const menuItems = [
    { label: "Profilo", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1119.07 6.93M15 11a3 3 0 11-6 0 3 3 0 016 0zm-9.828 6.364A7.963 7.963 0 0112 15c2.21 0 4.21.896 5.657 2.343" />
      </svg>
    )},
    { label: "Notifiche", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405C18.432 15.21 18 14.11 18 13V9a6 6 0 00-9.33-4.908" />
      </svg>
    )},
    { label: "Storico", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { label: "Appuntamenti", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { label: "Logout", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0V7a3 3 0 116 0v1" />
      </svg>
    )}
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Banner />

      <div className="grid grid-cols-[200px_1fr] gap-0 p-4">
        {/* Menu sinistro scrollabile */}
        <div className="bg-white py-4 ml-8 rounded-3xl shadow-md overflow-y-auto w-[100px] max-h-[56%] min-h-[440px] overflow-y-hidden text-center">
          <ul className="space-y-0">
            {menuItems.map(({label, icon}, index) => {
              const isSelected = selectedMenu === label;
              return (
                <li key={index}>
                  <button
                    onClick={() => setSelectedMenu(label)}
                    className={`group relative flex flex-col items-center w-full py-4 px-2 transition-all duration-200 ${label !== 'Logout' ? 'border-b-2' : ''}
                      ${isSelected ? 'text-blue-700' : 'border-b-gray-100 border-l-4 border-l-transparent'}
                    `}
                  >
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all duration-200
                      ${isSelected ? 'bg-blue-900 opacity-100' : 'bg-blue-900 opacity-0 group-hover:opacity-100'}
                    `} />

                    {React.cloneElement(icon, { className: `h-6 w-6 mb-1 transition-colors duration-200 ${isSelected ? 'text-blue-700' : 'group-hover:text-blue-700'}` })}
                    <span className="text-sm">{label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Contenuto principale con altezza dinamica */}
        <main className="bg-white p-6 rounded-3xl shadow -ml-4">
          <h2 className="text-2xl text-blue-900 font-bold mb-4">{selectedMenu}</h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
