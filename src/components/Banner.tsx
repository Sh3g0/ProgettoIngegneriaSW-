'use client';
import { useEffect, useState } from 'react';
import '../styles/style.css'; 
import { Home, Building, Phone, User } from "lucide-react";  
import { useRouter } from 'next/navigation';

const API_KEY = 'a8413d6ab16245ac94b1d5f489a18b9c';

export default function Banner() {
    const router = useRouter();
    const [lastZone, setLastZone] = useState('Roma');
    const [scrolled, setScrolled] = useState(false);

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
                const encodedParametri = encodeURIComponent(JSON.stringify({ lat, lng }));
                window.location.href = (`/VisualizzaImmobili?param=${encodedParametri}&searchkey=1`);
            }
        } catch (error) {
            console.error('Errore durante la ricerca delle coordinate:', error);
        }
    };

    return (
        <div className={`sticky top-0 z-50 w-full transition-colors duration-500 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className='w-full flex items-start justify-between px-6' style={{ height: '80px' }}>

                {/* Parte sinistra con il logo */}
                <div className="flex items-start justify-start w-[50%]">
                    <a href='/homeCliente'>
                        <img
                            src="/img/logo_oriz.png"
                            alt="Logo"
                            className="w-[220px] h-auto object-contain"
                        />
                    </a>
                </div>

                {/* Parte destra con il menu */}
                <div className="flex gap-4 text-black font-medium text-sm mt-7">
                    <a href="page" className='px-3 py-1 rounded-full flex gap-1 transition-all duration-300 hover:bg-blue-700'>
                        <Home size={16} /> Home
                    </a>
                    <a href="#" className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'>
                        <Building size={16} /> Proprietà
                    </a>
                    <a href="#" className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'>
                        <Phone size={16} /> Contatti
                    </a>
                    <a href="/login" className='px-3 py-1 rounded-full flex items-center gap-1 transition-all duration-300 hover:bg-blue-700'>
                        <User size={16} /> Accedi
                    </a>
                </div>
            </div>
        </div>
    );
}
