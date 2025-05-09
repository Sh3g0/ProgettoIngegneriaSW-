'use client';
import { useEffect, useState } from 'react';
import '../styles/style.css'; 
import { Home, Building, Phone, User } from "lucide-react";  

const API_KEY = 'a8413d6ab16245ac94b1d5f489a18b9c';

export default function Banner() {

    const [lastZone, setLastZone] = useState('Roma');

    useEffect(() => {
        const lastZone = localStorage.getItem('ultimaZonaSelezionata');
        if (lastZone) {
          setLastZone(lastZone);
        }
    });
           
    const switchToPropieties = async () => {
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lastZone}&key=${API_KEY}`);
            const data = await response.json();
      
            if (data.results.length > 0) {
              const { lat, lng } = data.results[0].geometry;
              const parametri = {
                lat,
                lng
              };
              const encodedParametri = encodeURIComponent(JSON.stringify(parametri));
              window.location.href = (`/VisualizzaImmobili?param=${encodedParametri}&searchkey=${'1'}`); //searchkey 1 per la ricerca con lat e lng
            }
          } catch (error) {
            console.error('Errore durante la ricerca delle coordinate:', error);
          }
    }

    return (
        <div className='relative top-0 w-full h-full flex items-center justify-between'>
            {/* Parte sinistra con il logo */}
            <div className="flex items-center justify-start w-[50%] pl-6">
                <a href='/homeCliente'>
                    <img
                        src="/img/logo_oriz.png"
                        alt="Logo"
                        className="w-[250px] h-auto object-contain"
                    />
                </a>
            </div>

            {/* Parte destra con il menu */}
            <div className="flex gap-4 text-black font-semibold text-lg pr-6">
                <a
                    href="/homeCliente"
                    className='px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-blue-600'
                    >
                    <Home size={18} /> Home
                </a>

                <a
                    href="#"
                    className='px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-blue-600'
                    >
                    <Building size={18} /> Proprietà
                </a>

                <a
                    href="#"
                    className='px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-blue-600'
                    >
                    <Phone size={18} /> Contatti
                </a>

                <a
                    href="#"
                    className='px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-blue-600'
                    >
                    <User size={18} /> Accedi
                </a>

            </div>
        </div>  
    );
}
