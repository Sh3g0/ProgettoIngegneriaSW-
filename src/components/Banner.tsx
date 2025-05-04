'use client';
import '../styles/style.css'; 
import { Home, Building, Phone, User } from "lucide-react";   

export default function Banner() {
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
                    className="px-4 py-1 rounded-full bg-blue-600 text-white flex items-center gap-2 transition-all duration-300 hover:bg-blue-700"
                >
                    <Home size={18} /> Home
                </a>
                <a
                    href="#"
                    className="px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                >
                    <Building size={18} /> Proprietà
                </a>
                <a
                    href="#"
                    className="px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                >
                    <Phone size={18} /> Contatti
                </a>
                <a
                    href="#"
                    className="px-4 py-1 rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                >
                    <User size={18} /> Accedi
                </a>
            </div>
        </div>  
    );
}
