'use client';

import '../../styles/style.css'; 
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import Banner from '@/components/Banner';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<'Affitto' | 'Vendita'>('Affitto');
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
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setBackgroundImage(backgrounds[randomIndex]);
  }, []);


  return (
    <div className="bg-white">
      <div className="w-full min-h-screen">
        {/* Hero Section */}
        <div
          className="relative w-full h-[800px] bg-cover bg-center"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover'
          }}          
        >
        <div className='absolute w-full border-none'>
          <Banner />
        </div>
         
          {/* Ricerca */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-1/2 sm:w-4/5 md:w-1/2 lg:w-1/2">

            {/* Titolo e Tabs */}
            <div className="flex flex-col items-center space-y-2 mt-8">
              <h1 className="text-3xl font-myfont mb-4">TROVA LA TUA CASA</h1>

              {/* Tabs con linea continua */}
              <div className="relative flex border-b-2 border-blue-300 w-full max-w-md justify-around">
                {['Affitto', 'Vendita'].map((option) => {
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setSelectedOption(option as 'Affitto' | 'Vendita')}
                      className={`
                        relative pb-2 text-xl font-bold text-white transition-colors duration-300
                        ${isSelected ? 'drop-shadow-[0_0_2px_black]' : 'hover:drop-shadow-[0_0_2px_black]'}
                      `}
                    >
                      {option.toUpperCase()}
                      <span
                        className={`absolute left-0 -bottom-[2px] h-[3px] w-full transition-all duration-300 ${
                          isSelected ? 'bg-blue-600' : 'bg-transparent'
                        }`}
                      ></span>
                    </button>
                  );
                })}
              </div>
            </div>

            <SearchBar />
          </div>      
        </div>
      </div>
    </div>
  );
}
