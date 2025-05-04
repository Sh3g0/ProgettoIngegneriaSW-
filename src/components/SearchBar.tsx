'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_KEY = 'a8413d6ab16245ac94b1d5f489a18b9c';

export default function SearchBar() {
  const router = useRouter();

  const [zone, setZone] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Carica i dati da JSON
  useEffect(() => {
    fetch('/italian_locations.json') // Assicurati che sia in public/
      .then((res) => res.json())
      .then((data) => setSuggestions(data));
  }, []);

  // Aggiorna i suggerimenti
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setZone(value);

    if (value.length > 1) {
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 10)); // Max 10 suggerimenti
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (value: string) => {
    setZone(value);
    setShowSuggestions(false);
  };

  //Funzione per la ricerca
  const handleSearch = async () => {
    const zoneSearch = zone.trim();

    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${zoneSearch}&key=${API_KEY}`);
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        const parametri = {
          id: -1, //Per cercare solo con lat e lng
          lat,
          lng,
          prezzo_min: 0,
          prezzo_max: 1000000,
          dimensione_mq: 0,
          piano: 0,
          stanze: 0,
          ascensore: false,
          classe_energetica: 'q',
          portineria: false,
          climatizzazione: false,
          tipo_annuncio: 'vendita',
        };

        if (zoneSearch) {
          const encodedParametri = encodeURIComponent(JSON.stringify(parametri));
          router.push(`/VisualizzaImmobili?param=${encodedParametri}`);
        }
      }
    } catch (error) {
      console.error('Errore durante la ricerca delle coordinate:', error);
    }


  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={zone}
        onChange={handleInputChange}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Provincia, Comune, Zona"
        className="w-full p-3 pr-12 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        type="submit"
        id="search-button"
        onClick={handleSearch}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
      >
        🔍
      </button>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
  );
}
