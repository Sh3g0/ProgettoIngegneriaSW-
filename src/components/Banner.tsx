'use client';
import { useEffect, useState } from 'react';
import '../styles/style.css'; 
import { Home, Building, Phone, User } from "lucide-react";  

const API_KEY = 'a8413d6ab16245ac94b1d5f489a18b9c';

export default function Banner() {

    const [activeLink, setActiveLink] = useState<string>('home'); // default attivo
    const [lastZone, setLastZone] = useState('Roma');

    useEffect(() => {

        const lastZone = localStorage.getItem('ultimaZonaSelezionata');
        if (lastZone) {
          setLastZone(lastZone);
        }

        const savedLink = localStorage.getItem('activeLink');
        if (savedLink) {
          setActiveLink(savedLink);
        }
    });

    const handleClick = (linkName: string, callback?: () => void) => (e: React.MouseEvent) => {
        setActiveLink(linkName);
        localStorage.setItem('activeLink', linkName);
        if (callback) callback();
    };
           
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
                <a href='/homeCliente'
                onClick={handleClick('home')}>
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
                    onClick={handleClick('home')}
                    className={`px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 ${
                        activeLink === 'home' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'
                    }`}
                    >
                    <Home size={18} /> Home
                </a>

                <a
                    href="#"
                    onClick={handleClick('proprieta', switchToPropieties)}
                    className={`px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 ${
                        activeLink === 'proprieta' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'
                    }`}
                    >
                    <Building size={18} /> Proprietà
                </a>

                <a
                    href="#"
                    className={`px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 ${
                        activeLink === 'contatti' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'
                    }`}
                    >
                    <Phone size={18} /> Contatti
                </a>

                <a
                    href="#"
                    onClick={handleClick('accedi')}
                    className={`px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 ${
                        activeLink === 'accedi' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'
                    }`}
                    >
                    <User size={18} /> Accedi
                </a>

            </div>
        </div>  
    );
}
