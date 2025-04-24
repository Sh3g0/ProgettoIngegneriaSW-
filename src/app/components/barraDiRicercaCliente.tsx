'use client';

import { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const immobiliFake = [
  {
    id: 1,
    titolo: 'Appartamento in centro',
    posizione: [40.8518, 14.2681],
    prezzo: 250000,
    superficie: 100,
    stanze: 3,
    tipologia: 'appartamento',
    descrizione: 'Appartamento in pieno centro città con tutti i servizi a portata di mano.'
  },
  {
    id: 2,
    titolo: 'Villa con giardino',
    posizione: [40.8618, 14.2781],
    prezzo: 450000,
    superficie: 180,
    stanze: 5,
    tipologia: 'casa',
    descrizione: 'Villa con ampio giardino e vista panoramica.'
  }
];

const CentroSuMarker = ({ posizione }) => {
  const map = useMap();
  map.setView(posizione, 15); 
  return null;
};

export default function BarraDiRicercaCliente() {
  const [immobili, setImmobili] = useState(immobiliFake);
  const [selezionato, setSelezionato] = useState(null);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Barra di ricerca */}
      <div className="p-4 bg-white w-full md:w-1/3 shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Ricerca Immobili</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Località o CAP" className="w-full border p-2 rounded" />

          <select className="w-full border p-2 rounded">
            <option>Tipologia</option>
            <option>Casa</option>
            <option>Appartamento</option>
            <option>Dimora di prestigio</option>
            <option>Terreno</option>
          </select>

          <div className="flex gap-2">
            <select className="w-1/2 border p-2 rounded">
              <option>Superficie da</option>
              <option>50 mq</option>
              <option>100 mq</option>
              <option>150 mq</option>
            </select>
            <select className="w-1/2 border p-2 rounded">
              <option>Superficie a</option>
              <option>100 mq</option>
              <option>150 mq</option>
              <option>200 mq</option>
            </select>
          </div>

          <div className="flex gap-2">
            <select className="w-1/2 border p-2 rounded">
              <option>Prezzo da</option>
              <option>100000</option>
              <option>200000</option>
              <option>300000</option>
            </select>
            <select className="w-1/2 border p-2 rounded">
              <option>Prezzo a</option>
              <option>200000</option>
              <option>300000</option>
              <option>500000</option>
            </select>
          </div>

          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Cerca</button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Risultati</h3>
          {immobili.map(immobile => (
            <div
              key={immobile.id}
              className={`border p-2 rounded mb-2 cursor-pointer hover:bg-gray-100 ${
                selezionato?.id === immobile.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => setSelezionato(immobile)}
            >
              <h4 className="font-semibold">{immobile.titolo}</h4>
              <p>{immobile.prezzo.toLocaleString()} € - {immobile.superficie} mq</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 h-1/2 md:h-full">
        <MapContainer center={[40.8518, 14.2681]} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {immobili.map(immobile => (
            <Marker key={immobile.id} position={immobile.posizione} icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            })}>
              <Popup>
                <strong>{immobile.titolo}</strong>
                <br />{immobile.prezzo.toLocaleString()} €
                <br />Superficie: {immobile.superficie} mq
                <br />Tipologia: {immobile.tipologia}
                <br />Descrizione: {immobile.descrizione}
              </Popup>
            </Marker>
          ))}

          {selezionato && <CentroSuMarker posizione={selezionato.posizione} />}
        </MapContainer>
      </div>
    </div>
  );
}
