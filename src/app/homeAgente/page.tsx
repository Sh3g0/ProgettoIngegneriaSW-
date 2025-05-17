'use client';

import '../../styles/style.css'; 
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import BannerAgente from '@/components/BannerAgente';
import Footer from '@/components/Footer';

export default function HomeAgente() {
  const [showAgenteOptions, setAgenteOption] = useState(true);

  const backgrounds = [
    'img/sfondo1.jpg',
    'img/sfondo2.jpg',
    'img/sfondo3.jpg',
    'img/sfondo4.jpg',
    'img/sfondo5.jpg',
    'img/sfondo6.jpg',
  ];
  
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
 
      setAgenteOption(true);
    
  })

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setBackgroundImage(backgrounds[randomIndex]);
  }, []);


  return (
    <div className="bg-white">
      <div className="w-full min-h-screen">
        {showAgenteOptions && (
          <div className="fixed bottom-5 right-5 w-16 h-16 bg-blue-500 text-white text-3xl rounded-full flex items-center justify-center shadow-xl hover:bg-blue-600 cursor-pointer z-50">
            <a href='/caricaImmobile'>+</a>
          </div>
        )}

        {/* Hero Section */}
        <div
          className="relative w-full h-[800px] bg-cover bg-center shadow-xl"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover'
          }}          
        >
          <div className='h-screen'>
            <div className='sticky top-0 z-50 w-full border-none'>
              <BannerAgente />
            </div>
          </div>
        
         
          {/* Ricerca */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-1/2 sm:w-4/5 md:w-1/2 lg:w-1/2">

            {/* Titolo e Tabs */}
            <div className="flex flex-col items-center space-y-2 mt-8">
              <h1 className="text-3xl font-myfont mb-4">TROVA LA TUA CASA</h1>
            </div>
            <SearchBar />
          </div>      
        </div>
        {/* Sezione Chi Siamo + Servizi */}
        <section className="bg-gray-100 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">I nostri servizi</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              DietiEstates25 offre soluzioni immobiliari personalizzate, combinando tecnologia e professionalità.
              Affidati a noi per vendere, affittare o trovare la casa dei tuoi sogni.
            </p>


            {/* Cards scrollabili */}
            <div className="flex overflow-x-auto gap-28 pb-32 min-h-[90px]">
              {[
                { title: "Ricerca Immobili", description: "Trova case in affitto o vendita in tutta Italia." },
                { title: "Valutazione Gratuita", description: "Scopri quanto vale il tuo immobile senza impegno." },
                { title: "Consulenza Mutuo", description: "Ti supportiamo nella scelta del finanziamento ideale." },
                { title: "Assistenza Legale", description: "Tutela e sicurezza durante l'intero processo." },
                { title: "Servizi Fotografici", description: "Valorizziamo al massimo il tuo immobile." },
              ].map((card, i) => (
                <div
                  key={i}
                  className="min-w-[220px] min-h-[300px] bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <h4 className="text-xl font-semibold text-blue-600 mb-2">{card.title}</h4>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer/>
    </div>
  );
}
