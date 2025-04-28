'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function IndirizzoImmobile() {
  const router = useRouter();
  const [comune, setComune] = useState('');
  const [indirizzo, setIndirizzo] = useState('');

  const handleAvanti = () => {
    console.log("Comune:", comune);
    console.log("Indirizzo:", indirizzo);
    router.push('/caricaImmobile2');
  };

  const handleIndietro = () => {
    console.log("Comune:", comune);
    console.log("Indirizzo:", indirizzo);
    router.push("/homeAgente"); 
  };

  const position: LatLngExpression = [40.8522, 14.2681]; 

  return (
    <div className="min-h-screen flex">
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
        {/* Logo */}
        <img src="/img/logo.png" alt="Logo" className="w-48 h-48 mb-6" />

        <label className="block text-gray-700 mb-2">Comune</label>
        <input
          type="text"
          placeholder="Inserisci il comune"
          value={comune}
          onChange={(e) => setComune(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-gray-700 mb-2">Indirizzo</label>
        <input
          type="text"
          placeholder="Via, numero civico..."
          value={indirizzo}
          onChange={(e) => setIndirizzo(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex w-full justify-between gap-4">
          <button
            onClick={handleIndietro}
            className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
          >
            ⬅ Indietro
          </button>
          <button
            onClick={handleAvanti}
            className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Avanti ➡
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="w-full h-full">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                {comune && indirizzo ? `${comune}, ${indirizzo}` : 'Seleziona un indirizzo'}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
