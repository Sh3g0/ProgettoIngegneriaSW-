'use client';
import { useEffect, useState } from 'react';
import '../styles/style.css'; 
import { Home, Building, Phone, User, MessageSquare } from "lucide-react";  
import { useRouter } from 'next/navigation';
import { useJwtPayload, UserInfo } from '@/components/useJwtPayload';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_GEO_API_KEY;

export default function Banner() {
  const router = useRouter();
  const [lastZone, setLastZone] = useState('Roma');
  const [scrolled, setScrolled] = useState(false);
  const user_info: UserInfo | null = useJwtPayload();

  useEffect(() => {
    const lastZone = localStorage.getItem('ultimaZonaSelezionata');
    if (lastZone) setLastZone(lastZone);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchToPropieties = async () => {
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lastZone}&key=${API_KEY}`);
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        const encodedParametri = encodeURIComponent(JSON.stringify({ lat, lng, status: 'accettato' }));
        window.location.href = (`/VisualizzaImmobili?param=${encodedParametri}&searchkey=1`);
      }
    } catch (error) {
      console.error('Errore durante la ricerca delle coordinate:', error);
    }
  };

  return (
    <div className={`sticky top-0 z-50 w-full transition-colors duration-500 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className='w-full flex items-center justify-between px-6' style={{ height: '80px' }}>

        {/* Parte sinistra con il logo */}
        <div className="flex items-center justify-start w-[50%]">
          <a href='/home'>
            <img
              src="/img/logo_oriz.png"
              alt="Logo"
              className="w-[220px] h-auto object-contain"
            />
          </a>
        </div>


        {/* Parte destra con il menu */}

        <div className="flex gap-4 text-black font-medium text-sm items-center px-3">

          <a href="/home" className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'>
            <Home size={16} /> Home
          </a>

          <a href="/VisualizzaImmobili" className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'>
            <Building size={16} /> Proprietà
          </a>


          {(user_info?.ruolo === 'agente' || user_info?.ruolo === 'cliente') && (
            <a
              href={user_info?.ruolo === 'agente' ? '/notifiche' : '/notificheCliente'}
              className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'
            >
              <MessageSquare size={16} /> Messaggi
            </a>
          )}


          {user_info?.ruolo === 'agente' && (
            <a href="/caricaImmobile" className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'>
              <Building size={16} /> Vendi proprietà
            </a>
          )}

          <a href="#" className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'>
            <Phone size={16} /> Contatti
          </a>

          {!user_info && (
            <a href="/login" className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'>
              <User size={16} /> Accedi
            </a>
          )}

          {user_info && (
            <a href='/profilo' className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'>
              <User size={16} /> {user_info.username || 'Profilo'}
            </a>
          )}

        </div>
      </div>
    </div>
  );
}
