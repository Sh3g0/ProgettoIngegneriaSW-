import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const RisultatoRicercaCliente = ({ immobile, onClick }) => {
  return (
    <div className="flex flex-col gap-4 border-b-2 pb-4">
      <div className="flex gap-4">
        <img
          src={immobile.foto}
          alt={immobile.immobile}
          className="w-32 h-32 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{immobile.immobile}</h3>
          <p>{immobile.tipologia} - {immobile.superficie} m²</p>
          <p>Prezzo: €{immobile.prezzo.toLocaleString()}</p>
          <p>Classe Energetica: {immobile.classeEnergetica}</p>
          <p>{immobile.descrizione}</p>
        </div>
      </div>

      <button
        onClick={() => onClick(immobile.latitudine, immobile.longitudine)}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
      >
        Vedi sulla mappa
      </button>
    </div>
  );
};

export default RisultatoRicercaCliente;
