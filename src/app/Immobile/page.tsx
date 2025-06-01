'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MappaImmobili from '@/components/MappaImmobili';
import Banner from '@/components/Banner';
import Footer from '@/components/Footer';
import { useJwtPayload } from '@/components/useJwtPayload';

const API_KEY = process.env.NEXT_PUBLIC_GEO_API_KEY;

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
    const [offerta, setOfferta] = useState("");
    const [menuCaratteristiche, setMenuCaratteristiche] = useState(false);

    const [showForm, setShowForm] = useState(false); // Stato per il controllo della visibilità del form
    const [selectedDate, setSelectedDate] = useState<string | null>(null); // Stato per la data selezionata
    const [selectedTime, setSelectedTime] = useState<string | null>(null); // Stato per l'orario selezionato

    // Funzione per confrontare due date solo per giorno, mese e anno
    const compareDates = (date1: string, date2: string) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        // Confronta solo anno, mese e giorno (ignora l'ora)
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const generateAvailableDays = (daysCount: number = 14): string[] => {
        const days: string[] = [];
        const today = new Date();
        today.setDate(today.getDate() + 1); // aggiunge 14 giorni
      
        for (let i = 0; i < daysCount; i++) {
          const futureDate = new Date(today);
          futureDate.setDate(today.getDate() + i);
          days.push(futureDate.toISOString());
        }
      
        return days;
    };
      
    const availableDays = generateAvailableDays();

    const availableTimes = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];

    // Funzione per aprire il form
    const openForm = () => {
        setShowForm(true);
    };

    // Funzione per chiudere il form
    const closeForm = () => {
        setShowForm(false);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleSendAppointment = () => {
        //Invia dati all'agente immobiliare

        alert(`Richiesta di appuntamento inviata per il ${selectedDate} alle ${selectedTime}.`);

        window.location.reload(); // Ricarica la pagina dopo l'invio
    }

    const formatNumber = (value: string) => {
        const numeric = value.replace(/[^\d]/g, ""); // Rimuove tutto tranne le cifre
        const formatted = Number(numeric).toLocaleString("it-IT");
        return numeric ? formatted : "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const formatted = formatNumber(raw);
        setOfferta(formatted);
    };

    useEffect(() => {
        if (!immID) return;

        const fetchImmobile = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/getImmobiliById', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: immID, status: 'accettato' }),
                });
                const data = await response.json();
                setImmobile(data[0]);

                console.log('Immobile data in immobile:', data[0]);
            } catch (e) {
                console.error('Error parsing immobile data:', e);
            }
        }
        fetchImmobile();
    }, [immID]);

useEffect(() => {
    if (!immobile?.id) return;

    const fetchImmagini = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getImmagini/${immobile.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = await response.json();

            if (data && data.immagini) {
                // Trasforma i path in oggetti Immagine
                const immaginiFormattate: Immagine[] = data.immagini.map((url: string) => ({
                    url: `http://localhost:3001${url}`
                }));

                setImmagini(immaginiFormattate);
            } else {
                console.error('Nessuna immagine trovata');
            }
        } catch (e) {
            console.error('Errore nel recupero immagini:', e);
        }
    };

    fetchImmagini();
}, [immobile]);

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


    const id = useJwtPayload()?.id;

useEffect(() => {
    if (!id || !immobile?.id) return; // Aspetta che entrambi siano definiti

    const updateStorico = async () => {
        console.log('Updating storico for user ID:', id, 'and immobile ID:', immobile.id);

        try {
            await fetch('http://localhost:3001/api/updateStorico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_utente: id,
                    id_immobile: immobile.id,
                    tipo_attivita: `Visualizzazione dell'immobile "${immobile.titolo}"`,
                }),
            });
        } catch (err) {
            console.error("Errore nell'update dello storico:", err);
        }
    };

    updateStorico();
}, [id, immobile]); // La useEffect parte SOLO quando id e immobile cambiano

    

    const openGallery = (imageUrl: string, index: number) => {
        setSelectedImage(imageUrl);
        setIsGalleryOpen(true);
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
        <div className='min-h-screen bg-gray-100 flex flex-col justify-center'>
            {/* Banner */}
            <div className="top-0 border-t-2 border-t-blue-700 border-b border-b-blue-700 shadow-md z-30 bg-white">
                <Banner />
            </div>


            {/* Display prezzo, titolo e indirizzo */}
            <div className='flex flex-col sticky bg-white top-0 z-20 lg:flex-row gap-0 border-b-1 border-b-blue-700 shadow-md'>
                <div className='flex flex-col items-center w-full lg:w-[30%] justify-center text-center p-2 border-r-2'>
                    <div className='w-full pb-1 text-3xl font-bold'>
                        € {Number(immobile?.prezzo).toLocaleString('it-IT')}
                    </div>

                    <div className='pt-1 text-xl flex justify-center w-full mt-2 top-0'>
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

                <div className='flex flex-col items-center hover:bg-green-700 w-full lg:w-[20%] justify-center font-bold text-3xl bg-green-600 text-white px-4 py-2 overflow-hidden'>
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
                    <div>
                        <a
                            href="#"
                            onClick={(e) => {
                            e.preventDefault(); // Previene il comportamento di navigazione
                            openForm();
                            }}
                            className="h-full w-full text-center flex items-center justify-center gap-2 hover:animate-wiggle"
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

                        {/* Modal/Popup Form */}
                        {showForm && (
                            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg w-96 min-w-[40%] relative">
                                    <button
                                    onClick={closeForm}
                                    className="absolute top-2 right-2 text-3xl p-4 text-gray-500 hover:text-black"
                                    >
                                    &times;
                                    </button>
                                    <h2 className="text-3xl text-black font-semibold mb-4">Prenota il tuo appuntamento</h2>
                                    <form>
                                        {/* Data di visita - Card scrollabili */}
                                        <div className="mb-4">
                                            <label htmlFor="date" className="block text-sm text-gray-700">
                                                Giorno di visita
                                            </label>
                                            <div className="flex overflow-x-auto gap-4 py-2 mt-2">
                                                {availableDays.map((dayIso) => {
                                                    const date = new Date(dayIso);
                                                    const day = date.getDate();
                                                    const month = date.toLocaleDateString('it-IT', { month: 'long' });
                                                    const year = date.getFullYear();

                                                    // Verifica se la data è selezionata, usando la funzione compareDates
                                                    const isSelected = compareDates(selectedDate ?? '', dayIso);

                                                    return (
                                                        <div
                                                        key={dayIso}
                                                        className={`
                                                            cursor-pointer min-w-[120px] w-28 h-24 rounded-lg overflow-hidden 
                                                            border-2 hover:shadow-md transition-all
                                                            ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
                                                        `}
                                                        onClick={() => setSelectedDate(dayIso)} // Seleziona la data quando clicchi
                                                        >
                                                            {/* Parte superiore: mese */}
                                                            <div className="bg-blue-600 text-white text-xs uppercase text-center py-1">
                                                                {month}
                                                            </div>

                                                            {/* Parte centrale: giorno */}
                                                            <div className="flex flex-col justify-center items-center h-full -my-2">
                                                                <span className={`text-2xl ${isSelected ? 'text-blue-600' : 'text-black'}`}>
                                                                {day}
                                                                </span>
                                                                <span className={`text-xs mt-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                                                                {year}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Orario - Card scrollabili */}
                                        <div className="mb-4">
                                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                                Orario
                                            </label>
                                            <div className="flex overflow-x-auto gap-4 py-2 mt-2">
                                                {availableTimes.map((time) => (
                                                    <div
                                                        key={time}
                                                        className={`
                                                        cursor-pointer min-w-[120px] w-28 h-16 rounded-lg overflow-hidden 
                                                        border-2 hover:shadow-md flex items-center justify-center
                                                        text-xl font-semibold transition-all duration-300
                                                        ${selectedTime === time ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-black'}
                                                        `}
                                                        onClick={() => setSelectedTime(time)}
                                                    >
                                                        {time}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Dati personali disposti uno accanto all'altro */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="col-span-1">
                                                <label htmlFor="name" className="block text-sm text-gray-700">
                                                Nome
                                                </label>
                                                <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className="text-black text-base bg-gray-100 focus:bg-white transition-colors duration-300 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label htmlFor="surname" className="block text-sm text-gray-700">
                                                Cognome
                                                </label>
                                                <input
                                                type="text"
                                                id="surname"
                                                name="surname"
                                                className="text-black text-base bg-gray-100 focus:bg-white transition-colors duration-300 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label htmlFor="phone" className="block text-sm text-gray-700">
                                                Telefono
                                                </label>
                                                <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                className="text-black text-base bg-gray-100 focus:bg-white transition-colors duration-300 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label htmlFor="email" className="block text-sm text-gray-700">
                                                Email
                                                </label>
                                                <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="text-black text-base bg-gray-100 focus:bg-white transition-colors duration-300 mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>



                                        <div className="flex justify-center">
                                            <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                                            onClick={() => handleSendAppointment()}
                                            >
                                                Invia richiesta
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/*Visualizzazione immagini*/}
            <div className='w-full flex justify-center items-center mt-4'>
                <div className='flex lg:w-[80%] justify-between gap-4 max-h-[630px]'>
                    {/* Colonna 1: Immagine principale */}
                    <div className='w-[70%] flex justify-center '>
                    <img
                        src={immagini?.[0]?.url || '/img/sfondo5.jpg'}
                        alt="Immobile Anteprima"
                        className='w-full h-auto rounded-2xl shadow-lg object-cover'
                        onClick={() => '/sfondo5.jpg'}
                    />
                    </div>

                    {/* Colonna 2: Miniature */}
                    <div className='w-[30%] p-0 flex flex-col gap-4 max-h-[800px]'>
                        {immagini?.slice(0, 3).map((immagine, index) => (
                            <div
                                key={index}
                                className={`flex justify-center max-h-[200px] ${index === 3 ? 'relative' : ''}`} // L'ultima immagine avrà la classe relativa
                            >
                                {/* Condizione per l'ultima immagine */}
                                {index === 2 ? (
                                        <div className="relative w-full max-h-[200px]">
                                            {/* Copertura trasparente grigia */}
                                            <div className="absolute inset-0 bg-gray-800 hover:bg-gray-900 opacity-50 flex justify-center items-center max-h-[200px] rounded-2xl"
                                                onClick={() => openGallery(immagine.url, index)}>
                                                <span className="text-white text-3xl font-bold">+</span>
                                            </div>
                                            <img
                                                src={immagine.url || '/img/sfondo5.jpg'}
                                                alt={`Immagine ${index + 1}`}
                                                className="w-full max-h-[200px] max-w-[100%] rounded-2xl cursor-pointer"
                                                />  
                                        </div>
                                ) : (
                                    <img
                                        src={immagine.url || '/img/sfondo5.jpg'}
                                        alt={`Immagine ${index + 1}`}
                                        className="w-full h-auto max-w-[100%] rounded-2xl cursor-pointer hover:opacity-80"
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
                    className="max-h-[70vh] w-auto mx-12 rounded-2xl shadow-lg object-contain"
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
                        className={`h-20 rounded-2xl cursor-pointer border-2 ${
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

            <div className="flex flex-row w-[80%] mx-auto gap-4 mt-4">
                {/* Colonna sinistra */}
                <div className="flex flex-col w-[70%] bg-white rounded-2xl shadow-lg p-4">
                    <div className="flex w-full">
                        <div className="flex font-bold text-3xl w-[50%] text-blue-500 p-4">
                            Caratteristiche
                        </div>
                        <div className="flex font-bold text-xl w-[50%] text-blue-500 p-4 justify-end">
                            <a href='#' className='text-white text-right bg-blue-500 p-2 rounded-2xl text-sm hover:bg-blue-600'>Scarica info.</a>
                        </div>
                    </div>

                    <div className="flex flex-row px-5 gap-8">
                        <div className="w-[50%] flex flex-col text-lg">
                            <div className="flex mb-4 border-b border-gray-300">
                                <div className="w-[50%]">RIF.</div>
                                <div className="w-[50%] text-left">{immobile ? immobile.id : 'N/A'}</div>
                            </div>
                            <div className="flex mb-4 border-b border-gray-300">
                                <div className="w-[50%]">Piano</div>
                                <div className="w-[50%] text-left">{immobile ? immobile.piano : 'N/A'}</div>
                            </div>
                            <div className="flex mb-4 border-b border-gray-300">
                                <div className="w-[50%]">Stanze</div>
                                <div className="w-[50%] text-left">{immobile ? immobile.stanze : 'N/A'}</div>
                            </div>
                            <div className="flex mb-4 border-b border-gray-300">
                                <div className="w-[50%]">Condizionamento</div>
                                <div className="w-[50%] text-left">{immobile?.climatizzazione === true ? 'Si' : 'No'}</div>
                            </div>
                            <div className='text-center'>
                            <button
                            className="text-blue-700 font-bold hover:underline"
                            onClick={() => setMenuCaratteristiche(true)}
                            >
                            Mostra altro
                            </button>

                            </div>
                        </div>

                        {/* Modal caratteristiche */}
                        {menuCaratteristiche && (
                        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
                            <div className="flex flex-col w-full max-w-3xl bg-white rounded-2xl shadow-lg p-4">
                            
                                {/* Titolo */}
                                <div className="flex w-full mb-4">
                                    <div className="font-bold text-3xl text-blue-500 p-4">
                                        Caratteristiche
                                    </div>
                                </div>

                                {/* Contenuto */}
                                <div className="flex flex-row px-5 gap-8">
                                    <div className="w-full flex flex-col text-lg">
                                    
                                        {/* Riga: RIF */}
                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">RIF.</div>
                                            <div className="w-1/2 text-left">{immobile ? immobile.id : 'N/A'}</div>
                                        </div>

                                        {/* Riga: Piano */}
                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">Piano</div>
                                            <div className="w-1/2 text-left">{immobile ? immobile.piano : 'N/A'}</div>
                                        </div>

                                        {/* Riga: Stanze */}
                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">Stanze</div>
                                            <div className="w-1/2 text-left">{immobile ? immobile.stanze : 'N/A'}</div>
                                        </div>

                                        {/* Riga: Condizionamento */}
                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">Condizionamento</div>
                                            <div className="w-1/2 text-left">
                                            {immobile?.climatizzazione === true ? 'Sì' : 'No'}
                                            </div>
                                        </div>

                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">Ascensore</div>
                                            <div className="w-1/2 text-left">
                                            {immobile?.ascensore === true ? 'Sì' : 'No'}
                                            </div>
                                        </div>

                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">Classe energetica</div>
                                            <div className="w-1/2 text-left">
                                            {immobile ? immobile.classe_energetica : 'N/A'}
                                            </div>
                                        </div>

                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">Portineria</div>
                                            <div className="w-1/2 text-left">
                                            {immobile?.portineria === true ? 'Sì' : 'No'}
                                            </div>
                                        </div>

                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">Vicino a scuole</div>
                                            <div className="w-1/2 text-left">
                                                {immobile?.vicino_scuole === true ? 'Sì' : 'No'}
                                            </div>
                                        </div>

                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">Vicino a parchi</div>
                                            <div className="w-1/2 text-left">
                                                {immobile?.vicino_parchi === true ? 'Sì' : 'No'}
                                            </div>
                                        </div>

                                        <div className="flex mb-4 border-b border-gray-300">
                                            <div className="w-1/2">Vicino a trasporti</div>
                                            <div className="w-1/2 text-left">
                                                {immobile?.vicino_trasporti === true ? 'Sì' : 'No'}
                                            </div>
                                        </div>

                                        {/* Bottone Chiudi */}
                                        <div className="text-center mt-4">
                                            <button
                                            className="text-blue-700 font-bold hover:underline"
                                            onClick={() => setMenuCaratteristiche(false)}
                                            >
                                            Chiudi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

                        <div className="w-[50%] bg-gray-100 rounded-2xl p-4 shadow-sm flex justify-between gap-6">
                        {/* Costi */}
                        <div className="w-1/2">
                            <p className="text-xl font-semibold text-blue-700">Costi</p>

                            {/* Prezzo */}
                            <div className="">
                                <p className="font-medium mt-4">Prezzo:</p>
                                <p className="text-black text-md font-bold">
                                    € {Number(immobile?.prezzo).toLocaleString('it-IT')}
                                </p>
                            </div>

                            {/* Prezzo al metro quadro */}
                            <div className="">
                                <p className="font-medium mt-2">Prezzo al m²:</p>
                                <p className="text-gray-700">
                                    {immobile?.prezzo && immobile?.dimensione_mq
                                    ? (immobile.prezzo / immobile.dimensione_mq).toFixed(2)
                                    : 'N/A'} €/m²
                                </p>
                            </div>
                        </div>

                        {/* Controfferta */}
                        <div className="w-1/2 flex flex-col justify-center">
                            <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="controfferta">
                            Invia una controfferta
                            </label>
                            <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            id="controfferta"
                            name="controfferta"
                            value={offerta}
                            onChange={handleChange}
                            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="€ Offerta"
                            />
                            <button
                            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                            onClick={() => alert(`Controfferta inviata: € ${offerta}`)}
                            >
                            Invia
                            </button>
                        </div>
                    </div>
                </div>
                </div>

                {/* Colonna destra */}
                <div className="w-[30%] bg-white rounded-2xl shadow-md p-6 text-gray-800">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Agenzia XYZ</h2>
                    <p className="mb-2"><span className="font-semibold">Indirizzo:</span> Via Roma 123, Milano</p>
                    <p className="mb-2"><span className="font-semibold">Telefono:</span> +39 0123 456789</p>
                    <p className="mb-2"><span className="font-semibold">Email:</span> info@agenziaxyz.it</p>
                    <p className="mt-4 text-sm text-gray-600">
                    Siamo un'agenzia con 10 anni di esperienza nel settore immobiliare. Offriamo consulenza personalizzata e un'ampia gamma di immobili.
                    </p>
                </div>
            </div>

            <div className="flex flex-row w-[80%] mx-auto gap-4 mt-4">
                {/* Div sinistro diviso in due righe */}
                <div className="w-[40%] bg-white rounded-2xl shadow-md p-4 text-gray-800 flex flex-col gap-4">
                    {/* Riga 1: Titolo + Indirizzo */}
                    <div className="flex flex-col h-full">
                        <div className="font-bold text-3xl text-blue-500 px-4 mb-4">
                            Descrizione
                        </div>
                        <div className="text-xl mt-2 ml-4 font-bold">
                            {immobile?.indirizzo || "Indirizzo immobile"}
                        </div>
                        <div className="text-xl mt-2 ml-4">
                            {immobile?.descrizione || "Descrizione immobile"}
                        </div>

                        {/* Bottone in basso */}
                        <div className="text-lg text-center mt-auto pt-4">
                            <button
                                className="text-blue-700 font-bold hover:underline"
                                onClick={() => setMenuCaratteristiche(true)}
                            >
                                Mostra altro
                            </button>
                        </div>
                    </div>
                </div>


                {/* Colonna destra con altezza variabile */}
                <div className="w-[60%] bg-white rounded-2xl shadow-md p-6 mt-0 flex flex-col min-h-[400px]">
                    <MappaImmobili immobili={immobile ? [immobile] : []} otherImmobili={[]} />
                </div>
            </div>
            <div className='mt-4'>
                <Footer/>
            </div>
        </div>         
    );
}
