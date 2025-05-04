import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';

interface Immobile {
  id: number;
  latitudine: number;
  longitudine: number;
  titolo: string;
  descrizione: string;
  immagine_url?: string;
  indirizzo: string;
}

interface Props {
  immobili: Immobile[];
  otherImmobili?: Immobile[];
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const shadowRightStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: '20px',
  height: '100%',
  boxShadow: '10px 0 15px rgba(0, 0, 0, 0.1)',
  pointerEvents: 'none',
  zIndex: 1,
};

const MappaImmobili = ({ immobili, otherImmobili }: Props) => {
  const [activeMarker, setActiveMarker] = useState<Immobile | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ lat: number; lng: number } | null>(null);

  const defaultCenter =
    immobili.length > 0
      ? { lat: immobili[0].latitudine, lng: immobili[0].longitudine }
      : { lat: 41.9028, lng: 12.4964 }; // Roma di default

  const handleMouseMove = (event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng;

    // Aggiungi il controllo per verificare che latLng non sia null
    if (latLng) {
      setCursorPosition({
        lat: latLng.lat(),
        lng: latLng.lng(),
      });
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={shadowRightStyle} />
      <LoadScript googleMapsApiKey="AIzaSyCu3Wd8xJFBwjdmpXpqCWBvzu7ACz8wXCM">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={13}
          onMouseMove={handleMouseMove} // Gestione movimento del mouse
        >
          {/* Marker blu per immobili principali */}
          {immobili.map((immobile) => (
            <Marker
              key={`immobile-${immobile.id}`}
              position={{
                lat: immobile.latitudine,
                lng: immobile.longitudine,
              }}
              title={immobile.titolo}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
              onMouseOver={() => setActiveMarker(immobile)} // Attivazione marker hover
              onMouseOut={() => setActiveMarker(null)} // Disattivazione quando mouse esce
            />
          ))}

          {/* Marker rosso per altri immobili */}
          {otherImmobili?.map((immobile) => (
            <Marker
              key={`altro-${immobile.id}`}
              position={{
                lat: immobile.latitudine,
                lng: immobile.longitudine,
              }}
              title={immobile.titolo}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
              onMouseOver={() => setActiveMarker(immobile)}
              onMouseOut={() => setActiveMarker(null)}
            />
          ))}

          {/* Anteprima che segue il cursore */}
          {activeMarker && cursorPosition && (
            <div
              className="absolute bg-white mt-4 p-2 rounded-xl shadow-md max-w-[300px] pointer-events-none"
              style={{
                left: cursorPosition.lng,
                top: cursorPosition.lat,
              }}
            >

              <div style={{ marginBottom: '10px' }}>
                <img
                  src={activeMarker.immagine_url || '/img/sfondo5.jpg'}
                  alt={activeMarker.titolo}
                  style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
                />
              </div>
              <h3 className='font-bold'>{activeMarker.titolo}</h3>
              <p>{activeMarker.descrizione}</p>
              <p><strong>Indirizzo:</strong> {activeMarker.indirizzo}</p>
            </div>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MappaImmobili;
