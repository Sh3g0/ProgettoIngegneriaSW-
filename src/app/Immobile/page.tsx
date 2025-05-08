'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MappaImmobili from '@/components/MappaImmobili';
import Banner from '@/components/Banner';

const API_KEY = 'a8413d6ab16245ac94b1d5f489a18b9c';

interface Immobile {
    id: number;
    id_agente: number;
    titolo: string;
    descrizione: string;
    prezzo: number;
    dimensione_mq: number;
    indirizzo: string;
    comune: string;
    citta: string;
    piano: number;
    stanze: number;
    ascensore: boolean;
    classe_energetica: string;
    portineria: boolean;
    climatizzazione: boolean;
    tipo_annuncio: string;
    latitudine: number;
    longitudine: number;
    vicino_scuole: boolean;
    vicino_parchi: boolean;
    vicino_trasporti: boolean;
    data: string;
    immagine_url?: string;
}

interface Immagine {
    url: string;
}

export default function ImmobilePage() {
    const immID = useSearchParams().get('id');
    const [immobile, setImmobile] = useState<Immobile | null>(null);

    const immaginiMock: Immagine[] = [
        { url: '/img/sfondo1.jpg' },
        { url: '/img/sfondo2.jpg' },
        { url: '/img/sfondo3.jpg' },
        { url: '/img/sfondo4.jpg' },
        { url: '/img/sfondo5.jpg' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [immagini, setImmagini] = useState<Immagine[]>(immaginiMock);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        if (!immID) return;

        const fetchImmobile = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/getImmobiliById', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: immID }),
                });
                const data = await response.json();
                setImmobile(data[0]);

                console.log('Immobile data in immobile:', data[0]);

                const fetchImmagini = async () => {
                    const response = await fetch('http://localhost:3001/api/getImmagini', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: immID }),
                    });

                    const data = await response.json();
                    if (data && data.length > 0) {
                        setImmagini(data);
                    } else {
                        console.error('No images found for the immobile');
                    }
                }
                fetchImmagini();
            } catch (e) {
                console.error('Error parsing immobile data:', e);
            }
        }
        fetchImmobile();
    }, [immID]);

    useEffect(() => {
        if (isGalleryOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    
        return () => {
            document.body.style.overflow = '';
        };
    }, [isGalleryOpen]);
    

    const openGallery = (imageUrl: string, index: number) => {
        setSelectedImage(imageUrl);
        setIsGalleryOpen(true);
        console.log('lebroooooon')
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
        setSelectedImage('');
    };

    const handlePrevImage = () => {
        const newIndex = currentIndex === 0 ? immagini.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        setSelectedImage(immagini[newIndex].url);
    };
      
    const handleNextImage = () => {
        const newIndex = currentIndex === immagini.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        setSelectedImage(immagini[newIndex].url);
    };

    return (
        <div className='min-h-screen flex flex-col'>
            {/* Banner */}
            <div className='border-t-2 border-t-blue-700 border-b-1 border-b-blue-700 shadow-md z-3'>
                <Banner />
            </div>

            {/* Display prezzo, titolo e indirizzo */}
            <div className='flex flex-col lg:flex-row gap-0 border-b-1 border-b-blue-700 shadow-md'>
                <div className='flex flex-col items-center w-full lg:w-[30%] justify-center text-center p-2 border-r-2'>
                    <div className='w-full pb-1 text-3xl font-bold'>
                        € {Number(immobile?.prezzo).toLocaleString('it-IT')}
                    </div>

                    <div className='pt-1 text-xl flex justify-center w-full mt-2 sticky top-0'>
                        <div className="flex w-[65%]">
                            {/* Dimensione m² */}
                            <div className="w-1/3 text-center flex flex-row items-center justify-center">
                                <svg className="w-6 h-6 text-red-500 mr-2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17h18M3 7h18M6 3v4M18 3v4M6 17v4M18 17v4" />
                                </svg>
                                <span className='text-lg'>{immobile?.dimensione_mq} m²</span>
                            </div>

                            {/* Stanze */}
                            <div className="w-1/3 text-center flex flex-row items-center justify-center">
                                <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v6H3V3zm0 8h8v10H3V11zm10 0h8v10h-8V11z" />
                                </svg>
                                <span className='text-lg'>{immobile?.stanze} stanze</span>
                            </div>

                            {/* Piano */}
                            <div className="w-1/3 text-center flex flex-row items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 3h16v18H4V3zm8 4l-2 3h4l-2-3zm0 10l2-3h-4l2 3z" />
                                </svg>
                                <span className='text-lg'>{immobile?.piano}° piano</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col items-left w-full lg:w-[50%] justify-left text-left p-2'>
                    <div className='w-full pb-1 font-bold text-3xl'>
                        {immobile?.titolo}
                    </div>
                    <div className='pt-1 mt-3 text-lg'>
                        {immobile?.indirizzo}
                    </div>
                </div>

                <div className='flex flex-col items-center hover:bg-red-700 w-full lg:w-[20%] justify-center font-bold text-3xl bg-red-600 text-white px-4 py-2 overflow-hidden'>
                    <style>
                        {`
                        @keyframes wiggle {
                            0%, 100% { transform: translateX(0); }
                            25% { transform: translateX(-4px); }
                            75% { transform: translateX(4px); }
                        }
                        .hover\\:animate-wiggle:hover {
                            animation: wiggle 0.4s ease-in-out;
                        }
                        `}
                    </style>
                    <a
                        href={`/PrenotaAppuntamento?id=${immobile?.id}`}
                        className='h-full w-full text-center flex items-center justify-center gap-2 hover:animate-wiggle'
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                        </svg>
                        Prenota un appuntamento
                    </a>
                </div>

            </div>

            {/*Visualizzazione immagini*/}
            <div className='w-full flex justify-center items-start mt-4'>
                <div className='flex lg:w-[80%] justify-between mb-4'>
                    {/* Colonna 1: Immagine principale */}
                    <div className='w-[70%] flex justify-center max-h-[800px]'>
                    <img
                        src={immobile?.immagine_url || '/img/sfondo5.jpg'}
                        alt="Immobile Anteprima"
                        className='w-full h-auto rounded-lg shadow-lg object-cover'
                    />
                    </div>

                    {/* Colonna 2: Miniature */}
                    <div className='w-[30%] p-2 flex flex-col gap-4 overflow-y-auto max-h-[800px]'>
                        {immagini?.slice(0, 4).map((immagine, index) => (
                            <div
                                key={index}
                                className={`flex justify-center max-h-[200px] ${index === 3 ? 'relative' : ''}`} // L'ultima immagine avrà la classe relativa
                            >
                                {/* Condizione per l'ultima immagine */}
                                {index === 3 ? (
                                        <div className="relative w-full max-h-[200px]">
                                            {/* Copertura trasparente grigia */}
                                            <div className="absolute inset-0 bg-gray-800 hover:bg-gray-900 opacity-50 flex justify-center items-center max-h-[200px]"
                                                onClick={() => openGallery(immagine.url, index)}>
                                                <span className="text-white text-3xl font-bold">+</span>
                                            </div>
                                            <img
                                                src={immagine.url || '/img/sfondo5.jpg'}
                                                alt={`Immagine ${index + 1}`}
                                                className="w-full max-h-[200px] max-w-[100%] rounded-lg cursor-pointer"
                                                />  
                                        </div>
                                ) : (
                                    <img
                                        src={immagine.url || '/img/sfondo5.jpg'}
                                        alt={`Immagine ${index + 1}`}
                                        className="w-full h-auto max-w-[100%] rounded-lg cursor-pointer hover:opacity-80"
                                        onClick={() => openGallery(immagine.url, index)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal per la galleria */}
            {isGalleryOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex flex-col justify-center items-center">
                {/* Bottone Chiudi */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setIsGalleryOpen(false)}
                    className="text-white text-2xl font-bold hover:text-blue-600"
                  >
                    ✕
                  </button>
                </div>
              
                {/* Immagine con frecce */}
                <div className="relative flex items-center justify-center w-full max-w-5xl px-4">
                  {/* Freccia Sinistra */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-0 text-white text-5xl px-4 hover:text-blue-500"
                  >
                    ❮
                  </button>
              
                  {/* Immagine principale */}
                  <img
                    src={selectedImage}
                    alt="Galleria"
                    className="max-h-[70vh] w-auto mx-12 rounded-lg shadow-lg object-contain"
                  />
              
                  {/* Freccia Destra */}
                  <button
                    onClick={handleNextImage}
                    className="absolute right-0 text-white text-5xl px-4 hover:text-blue-500"
                  >
                    ❯
                  </button>
                </div>
              
                {/* Anteprime immagini */}
                <div className="mt-6 flex gap-4 overflow-x-auto max-w-4xl px-4">
                  {immagini.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={`Thumb ${index + 1}`}
                      className={`h-20 rounded-md cursor-pointer border-2 ${
                        selectedImage === img.url ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => {
                        setSelectedImage(img.url);
                        setCurrentIndex(index);
                      }}
                    />
                  ))}
                </div>
              </div>            
            )}
        </div>
        
    );
}
