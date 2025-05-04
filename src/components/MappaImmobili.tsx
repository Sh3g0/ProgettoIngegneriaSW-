import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';

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
  otherImmobili: Immobile[];
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
  const [defaultCenter, setDefaultCenter] = useState<{ lat: number; lng: number }>({
    lat: 41.9028,
    lng: 12.4964,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (immobili.length > 0) {
      const pos = {
        lat: immobili[0].latitudine,
        lng: immobili[0].longitudine,
      };
      setDefaultCenter(pos);
      setCursorPosition(pos);
    } else if (otherImmobili.length > 0) {
      const pos = {
        lat: otherImmobili[0].latitudine,
        lng: otherImmobili[0].longitudine,
      };
      setDefaultCenter(pos);
      setCursorPosition(pos);
    } else {
      setCursorPosition({ lat: 41.9028, lng: 12.4964 });
    }
  }, [immobili, otherImmobili]);

  const handleMouseMove = (event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng;
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
          onLoad={(map: google.maps.Map) => {
            mapRef.current = map;
            return; // esplicito
          }}
          onMouseMove={handleMouseMove}
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
              onMouseOver={() => setActiveMarker(immobile)}
              onMouseOut={() => setActiveMarker(null)}
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
        </GoogleMap>

        {/* InfoBox o preview laterale — non fluttuante sul cursore */}
        {activeMarker && (
          <div
            className="absolute right-4 top-4 bg-white p-4 rounded-xl shadow-lg max-w-[300px] pointer-events-none"
          >
            <div style={{ marginBottom: '10px' }}>
              <img
                src={activeMarker.immagine_url || '/img/sfondo5.jpg'}
                alt={activeMarker.titolo}
                style={{ width: '100%', height: 'auto', borderRadius: '5px' }}
              />
            </div>
            <h3 className="font-bold">{activeMarker.titolo}</h3>
            <p>{activeMarker.descrizione}</p>
            <p>
              <strong>Indirizzo:</strong> {activeMarker.indirizzo}
            </p>
          </div>
        )}
      </LoadScript>
    </div>
  );
};

export default MappaImmobili;
