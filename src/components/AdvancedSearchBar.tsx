'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrezzoDropdown from '@/components/PrezzoDropdown';

const API_KEY = 'a8413d6ab16245ac94b1d5f489a18b9c';

export default function AdvancedSearchBar() {
  const router = useRouter();
  const [zone, setZone] = useState('');
  const [zoneInput, setZoneInput] = useState('');
  const [tipoAnnuncio, setTipoAnnuncio] = useState('affitto');
  const [prezzoMin, setPrezzoMin] = useState(0);
  const [prezzoMax, setPrezzoMax] = useState(2000000);
  const [superficie, setSuperficie] = useState(0);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPrezzoLabel, setSelectedPrezzoLabel] = useState('Prezzo');
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // Stato per tenere traccia del menu attivo
  const [stanze, setStanze] = useState(0);
  const [piano, setPiano] = useState(0);
  const [ascensore, setAscensore] = useState(false);
  const [classeEnergetica, setClasseEnergetica] = useState('q');
  const [portineria, setPortineria] = useState(false);
  const [climatizzazione, setClimatizzazione] = useState(false);


const handleSearch = async () => {

  if (!zone || !suggestions.includes(zone)) {
    alert('Per favore, seleziona una zona valida');
    return;
  }
  

  try{
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${zone}&key=${API_KEY}`);
    const data = await response.json();

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      const parametri = {
        id: -2, // Per cercare con i parametri completi
        lat,
        lng,
        tipoAnnuncio,
        prezzoMin,
        prezzoMax,
        superficie,
        stanze,
        piano,
        ascensore,
        classeEnergetica,
        portineria,
        climatizzazione
      }
      try{
        const encodedParametri = encodeURIComponent(JSON.stringify(parametri));
        console.log('Esegui ricerca con:', {
          lat,
          lng,
          tipoAnnuncio,
          prezzoMin,
          prezzoMax,
          superficie,
          stanze,
          piano,
          ascensore,
          classeEnergetica,
          portineria,
          climatizzazione,
        });

        const timestamp = new Date().getTime(); // Aggiungi un parametro unico per evitare cache
        window.location.href = `/VisualizzaImmobili?param=${encodedParametri}&timestamp=${timestamp}`;
        
      }catch (error) {
        console.error('Errore durante la ricerca:', error);
      }
    } 
  }catch (error) {
    console.error('Errore durante la ricerca delle coordinate:', error);
  }
}

  useEffect(() => {
    fetch('/italian_locations.json')
      .then((res) => res.json())
      .then((data) => {
        console.log('Dati caricati:', data);  // Verifica cosa viene restituito
        setSuggestions(data);
      })
      .catch((error) => {
        console.error('Errore nel caricamento dei dati:', error);
      });
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setZone(value);

    if (value.length > 1) {
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (value: string) => {
    setZone(value);        // valore valido selezionato
    setZoneInput(value);   // mostra il testo selezionato
    setShowSuggestions(false);    
  };

  const clearZone = () => {
    setZone('');
    setZoneInput('');
  };
  
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
    if (filtersVisible) setActiveMenu(null); // Chiudi tutti i menu quando "Altri filtri" è chiuso
  };

  const resetAll = () => {
    setZone('');
    setTipoAnnuncio('affitto');
    setPrezzoMin(0);
    setPrezzoMax(2000000);
    setSelectedPrezzoLabel('Prezzo');
    setSuperficie(0);
    setFiltersVisible(false);
    setActiveMenu(null); // Chiudi tutti i menu
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(prevMenu => prevMenu === menu ? null : menu); // Se il menu è già aperto, lo chiude, altrimenti lo apre
  };

  return (
    <div className="relative relative w-full h-16 z-50">
      <div className="flex h-full border-b-0 border-gray-300 shadow-md border">
        {/* Zona */}
        <div className="h-full w-[30%] col-span-1 border-r-4 border-r-blue-500">
          <div className="flex items-center w-full h-full">
            <input
              type="text"
              value={zoneInput}
              onChange={(e) => {
                const value = e.target.value;
                setZoneInput(value);
                setZone(value); // manteniamo sincronizzati

                if (value.length > 1) {
                  const filtered = suggestions.filter((item) =>
                    item.toLowerCase().includes(value.toLowerCase())
                  );
                  setFilteredSuggestions(filtered.slice(0, 10));
                  setShowSuggestions(true);
                } else {
                  setShowSuggestions(false);
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Inserisci zona"
              className={`px-3 py-4 border-l-0 border-t-0 border-r-0 border-b-0 rounded-none w-full h-full focus:outline-none focus:ring-0
                ${zone && suggestions.includes(zone) ? 'font-bold' : ''}
              `}
            />

            {zone && (
              <button
                onClick={clearZone}
                className="text-red-500 text-xl relative right-1 border-b-0 border-t-0"
                aria-label="Clear Zone"
              >
                ✖
              </button>
            )}
          </div>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="absolute w-[30%] left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50">
              {filteredSuggestions.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tipo Annuncio */}
        <div className="relative h-full w-[10%] col-span-1 border-gray-300">
          <button
            onClick={() => toggleMenu('tipoAnnuncio')}
            className="font-bold flex justify-between items-center px-3 bg-white border-r-4 border-r-blue-500 border-t-1 border-t-blue-500 w-full h-full focus:outline-none"
          >
            <span className="text-left capitalize">{tipoAnnuncio}</span>
            <span className="ml-2">{activeMenu === 'tipoAnnuncio' ? '▲' : '▼'}</span>
          </button>
          {activeMenu === 'tipoAnnuncio' && (
            <div className="absolute bg-white border rounded shadow-lg w-full">
              <ul>
                {['affitto', 'vendita'].map((val) => (
                  <li
                    key={val}
                    onClick={() => {
                      setTipoAnnuncio(val);
                      setActiveMenu(null); // Chiudi il menu
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer capitalize"
                  >
                    {val}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Prezzo Dropdown */}
        <div className="relative h-full w-[15%] col-span-1 border-b-0 border-gray-300">
          <button
            onClick={() => toggleMenu('prezzoDropdown')}
            className="font-bold flex justify-between items-center px-3 bg-white border-r-4 border-r-blue-500 border-t-1 border-t-blue-500 border-r-0 border-b-1 rounded-none w-full h-full focus:outline-none focus:ring-0"
          >
            <span className="text-left">{selectedPrezzoLabel}</span>
            <span className="ml-2">{activeMenu === 'prezzoDropdown' ? '▲' : '▼'}</span>
          </button>
          {activeMenu === 'prezzoDropdown' && (
            <div className="absolute bg-white border rounded shadow-lg w-full">
              <PrezzoDropdown
                prezzoMin={prezzoMin}
                prezzoMax={prezzoMax}
                setPrezzoMin={setPrezzoMin}
                setPrezzoMax={setPrezzoMax}
                onConfirm={() => {
                  const label = `${Number(prezzoMin).toLocaleString()}€ - ${Number(prezzoMax).toLocaleString()}€`;
                  setSelectedPrezzoLabel(label);
                  setActiveMenu(null); // Chiudi il menu
                }}
              />
            </div>
          )}
        </div>

        {/* Superficie */}
        <div className="relative h-full w-[10%] col-span-1 border-b-0 border-gray-300">
          <button
            onClick={() => toggleMenu('superficie')}
            className="font-bold flex justify-between items-center px-3 bg-white border-r-4 border-r-blue-500 border-t-1 border-t-blue-500 w-full h-full focus:outline-none"
          >
            <span className="text-left">
              {superficie ? `${superficie} m²` : 'Superficie'}
            </span>
            <span className="ml-2">{activeMenu === 'superficie' ? '▲' : '▼'}</span>
          </button>
          {activeMenu === 'superficie' && (
            <div className="absolute bg-white border rounded shadow-lg w-full max-h-48 overflow-y-auto">
              <ul>
                {[...Array(28)].map((_, i) => {
                  const val = (i + 1) * 10;
                  return (
                    <li
                      key={val}
                      onClick={() => {
                        setSuperficie(val);
                        setActiveMenu(null); // Chiudi il menu
                      }}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {val} m²
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Altri filtri */}
        <div className="relative h-full w-[10%] border-l border-gray-300">
          <button
            onClick={() => {
              toggleMenu('filters');
              setFiltersVisible(!filtersVisible); // Inverti visibilità solo se clicchi sul pulsante
            }}
            className="flex justify-between items-center px-3 bg-white border-t-1 border-t-blue-500 w-full h-full focus:outline-none hover:border-b-2 hover:border-blue-600 transition duration-200"
          >
            <span className="text-left">Altri filtri</span>
            <span className="ml-0 mr-1">{filtersVisible ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* Pulsanti azione */}
        <div className="flex items-center justify-end pr-6 pl-4 w-[25%] space-x-3 bg-transparent">
          {/* Pulsante Pulisci */}
          <button
            onClick={resetAll}
            className="text-sm text-blue-700 hover:underline px-2 py-1"
          >
            🧹 Pulisci
          </button>

          {/* Pulsante Cerca con sfondo smussato */}
          <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 shadow-sm">
            <button
              onClick={() => {
                if (filtersVisible) toggleFilters();
                handleSearch();
                
              }}
              className="text-sm font-semibold"
            >
              🔍 Cerca
            </button>
          </div>
        </div>
      </div>

      {/* Modal Altri filtri */}
      {filtersVisible && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => {
              setFiltersVisible(false);
              setActiveMenu(null); // Chiudi il menu quando si clicca fuori
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-lg shadow-xl p-6 space-y-4">
            <div>
              <label htmlFor="stanze" className="block text-sm font-medium">Numero di stanze</label>
              <input
                type="number"
                id="stanze"
                placeholder="Stanze"
                min="0"
                className="w-full mt-2 px-2 py-1 border rounded text-sm"
                value={stanze}
                onChange={(e) => setStanze(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="piano" className="block text-sm font-medium">Piano</label>
              <input
                type="number"
                id="piano"
                placeholder="Piano"
                min="1"
                className="w-full mt-2 px-2 py-1 border rounded text-sm"
                value={piano}
                onChange={(e) => setPiano(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="ascensore" 
                className="h-4 w-4"
                checked={ascensore}
                onChange={(e) => setAscensore(e.target.checked)}
               />
              <label htmlFor="ascensore" className="text-sm">Presenza ascensore</label>
            </div>
            <div>
              <label htmlFor="classeEnergetica" className="block text-sm font-medium">Classe energetica</label>
              <select
                id="classeEnergetica"
                className="w-full mt-2 px-2 py-1 border rounded text-sm"
                value={classeEnergetica}
                onChange={(e) => setClasseEnergetica(e.target.value)}
              >
                <option value="q">Qualsiasi</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="portineria" 
                className="h-4 w-4" 
                checked={portineria}
                onChange={(e) => setPortineria(e.target.checked)}
                />
              <label htmlFor="portineria" className="text-sm">Portineria</label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="climatizzazione" 
                className="h-4 w-4" 
                checked={climatizzazione}
                onChange={(e) => setClimatizzazione(e.target.checked)}
                />
              <label htmlFor="climatizzazione" className="text-sm">Climatizzazione</label>
            </div>
            <button
              onClick={toggleFilters}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Chiudi
            </button>
          </div>
        </>
      )}
    </div>
  );
}
