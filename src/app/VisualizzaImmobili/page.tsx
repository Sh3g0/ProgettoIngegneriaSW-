'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Banner from '@/components/Banner';
import AdvancedSearchBar from '@/components/AdvancedSearchBar';
import MappaImmobili from '@/components/MappaImmobili';
import Image from 'next/image';
import { decode } from 'punycode';

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

interface Parametri{
  id: number;
  lat: number;
  lng: number;
  prezzo_min: number;
  prezzo_max: number;
  dimensione_mq: number;
  piano: number;
  stanze: number;
  ascensore: boolean;
  classe_energetica: string;
  portineria: boolean;
  climatizzazione: boolean;
  tipo_annuncio: string;
}

export default function VisualizzaImmobili() {

  const [immobili, setImmobili] = useState<Immobile[]>([]);
  const [otherImmobili, setOtherImmobili] = useState<Immobile[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const parametri = searchParams.get('param');
  const [decodedParams, setParametri] = useState<Parametri | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchImmobili = async () => {
    if (!parametri) return;

    try {
      const parsedParams = JSON.parse(decodeURIComponent(parametri));
      setParametri(parsedParams);

      const response = await fetch(`http://localhost:3001/api/showImmobili`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedParams),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Errore HTTP: ${response.status} - ${text}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setImmobili(data);

        //Cambio parametri per ottenere altri immobili
        parsedParams.id = -1;

        const response = await fetch(`http://localhost:3001/api/showImmobili`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedParams),
        });
  
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Errore HTTP: ${response.status} - ${text}`);
        }

        let otherData = await response.json();
        if (otherData && otherData.length > 0) {
          const filtered = otherData.filter(
            (item1: Immobile) => !data.some((item2: Immobile) => item2.id === item1.id));
          setOtherImmobili(filtered);
        }
      } else {
        setError('Nessun immobile trovato nella zona.');
      }
    } catch (error) {
      console.error('Errore durante il recupero degli immobili:', error);
      setError('Impossibile recuperare gli immobili.');
    } finally {
      setLoading(false);
    }
  };

  fetchImmobili();

}, [parametri]);


  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="relative w-full z-99">
        <div className="absolute top-0 left-0 w-full h-32 border-b border-t-4 border-blue-700 border-b-0" />
        <div className="relative border-b-2 border-b-blue-700">
          <Banner />
        </div>
        <div className='text-blue-700'>
          <AdvancedSearchBar />
        </div>
      </div>


      <div className="p-0 flex-grow flex flex-col lg:flex-row gap-4 h-[calc(100vh-128px)]">
        <div className="w-full lg:w-[60%] p-0">
          <div className="relative w-full h-full relative">
            <MappaImmobili immobili={immobili} otherImmobili={otherImmobili}/>
          </div>
        </div>

        <div className="lg:w-[40%] h-[97%] overflow-y-scroll pl-4">
          <h2 className="text-4xl font-extrabold text-blue-800 mt-10 mb-4 drop-shadow-md">
            Case in vendita a:{' '}
            {immobili.length > 0
              ? immobili[0].citta
              : otherImmobili.length > 0
              ? otherImmobili[0].citta
              : ''}
          </h2>


          <div className='flex flex-col items-center'>
            <div className='w-full border-b-2 border-t-2 border-blue-700 mt-6 mb-2'>
              <p className='mt-2 mb-2'>📍 {immobili.length} risultati trovati</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
            {immobili.map((immobile) => (
              <a href='/immobile' key={immobile.id}>
                <div className="h-[280px] w-full p-0 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-200">
                  <div className="relative h-[150px] w-full">
                    <Image
                      src={immobile.immagine_url || '/img/sfondo5.jpg'}
                      layout="fill"
                      alt=""
                      objectFit="cover"
                      className="rounded-t-xl"
                    />
                    <p className="absolute top-0 right-0 text-blue-700 font-bold text-lg bg-blue-100 p-1 rounded-bl-xl rounded-tr-xl">
                      €{Number(immobile.prezzo).toLocaleString('it-IT')}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-b-xl h-[46%] p-2">
                    <h3 className="font-semibold text-xl truncate">{immobile.titolo}</h3>
                    <p className="text-sm text-gray-600 truncate mt-2">{immobile.indirizzo}</p>

                    <div className="border-t-2 border-gray-300 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17h18M3 7h18M6 3v4M18 3v4M6 17v4M18 17v4" />
                          </svg>
                          <span className="text-gray-700">{immobile.dimensione_mq} m²</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v6H3V3zm0 8h8v10H3V11zm10 0h8v10h-8V11z" />
                          </svg>
                          <span className="text-gray-700">{immobile.stanze} stanze</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 3h16v18H4V3zm8 4l-2 3h4l-2-3zm0 10l2-3h-4l2 3z" />
                          </svg>
                          <span className="text-gray-700">{immobile.ascensore ? "Con ascensore" : "Senza ascensore"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className='flex flex-col items-center'>
            <div className='w-full border-b-2 border-t-2 border-blue-700 mt-6 mb-2'>
              <p className='mt-2 mb-2'>Altri risultati ({otherImmobili.length})</p>
            </div>
          </div>
          <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-4 pr-4 mt-4 mb-2">
            
              {otherImmobili.map((immobile) => (
                //////////////////////////////////////////////////
                //<a href={`/Immobili?id=${immobile.id}`}>
                <div className="h-[280px] w-full p-0 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-200">
                    <div className="relative h-[150px] w-full">
                      <Image
                        src={immobile.immagine_url || '/img/sfondo5.jpg'}
                        layout="fill"
                        alt=""
                        objectFit="cover"
                        className="rounded-t-xl"
                      />
                      <p className="absolute top-0 right-0 text-blue-700 font-bold text-lg bg-blue-100 p-1 rounded-bl-xl rounded-tr-xl">
                        €{Number(immobile.prezzo).toLocaleString('it-IT')}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-b-xl h-[46%] p-2">
                      <h3 className="font-semibold text-xl truncate">{immobile.titolo}</h3>
                      <p className="text-sm text-gray-600 truncate mt-2">{immobile.indirizzo}</p>

                      <div className="border-t-2 border-gray-300 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17h18M3 7h18M6 3v4M18 3v4M6 17v4M18 17v4" />
                            </svg>
                            <span className="text-gray-700">{immobile.dimensione_mq} m²</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v6H3V3zm0 8h8v10H3V11zm10 0h8v10h-8V11z" />
                            </svg>
                            <span className="text-gray-700">{immobile.stanze} stanze</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 3h16v18H4V3zm8 4l-2 3h4l-2-3zm0 10l2-3h-4l2 3z" />
                            </svg>
                            <span className="text-gray-700">{immobile.ascensore ? "Con ascensore" : "Senza ascensore"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                //////////////////////////////////////////////////////
                //</a>
              ))}
            </div>
        </div>
      </div>
      <footer className='h-[200px] bg-blue text-white text-center py-4 mt-auto'>
        lebron
      </footer>
    </div>
  );
}
