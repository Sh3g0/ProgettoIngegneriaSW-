'use client'

import React, { useState } from 'react';

const PropertyForm = () => {
  // Stato per gestire i dati del form
  const [address, setAddress] = useState('');
  const [contractType, setContractType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState({
    size: '',
    floor: '',
    rooms: '',
    energyClass: '',
  });
  const [facilities, setFacilities] = useState({
    elevator: false,
    concierge: false,
    airConditioning: false,
  });

  // Gestione dell'input per l'indirizzo
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  // Gestione dell'input per la tipologia di contratto
  const handleContractChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContractType(e.target.value);
  };

  // Gestione dell'input per il titolo
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Gestione dell'input per la descrizione
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  // Gestione dell'input per le dimensioni dell'immobile
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDimensions({ ...dimensions, [e.target.name]: e.target.value });
  };

  // Gestione dei servizi (ascensore, portineria, climatizzazione)
  const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacilities({ ...facilities, [e.target.name]: e.target.checked });
  };

  // Funzione di submit del form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      contractType,
      title,
      address,
      description,
      dimensions,
      facilities,
    });
  };

  return (
    <div className="container">
      <h2 className="text-2xl font-semibold mb-4">Inserisci i dati del tuo immobile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipologia di contratto e titolo */}
        <div className="flex gap-6">
          <div className="w-1/2">
            <label htmlFor="contractType" className="block text-sm font-medium">Tipologia di contratto</label>
            <select
              id="contractType"
              value={contractType}
              onChange={handleContractChange}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="">Seleziona</option>
              <option value="vendita">Vendita</option>
              <option value="affitto">Affitto</option>
            </select>
          </div>
          <div className="w-1/2">
            <label htmlFor="title" className="block text-sm font-medium">Titolo</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="Inserisci il titolo"
            />
          </div>
        </div>

        {/* Indirizzo dell'immobile */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium">Indirizzo</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={handleAddressChange}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Inserisci l'indirizzo"
          />
        </div>

        {/* Descrizione dell'immobile */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Descrizione</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Descrivi l'immobile"
          />
        </div>

        {/* Dettagli immobile: dimensione, piano, stanze, classe energetica */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="size" className="block text-sm font-medium">Dimensione in mq</label>
            <input
              id="size"
              type="text"
              name="size"
              value={dimensions.size}
              onChange={handleDimensionChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="floor" className="block text-sm font-medium">Piano</label>
            <input
              id="floor"
              type="text"
              name="floor"
              value={dimensions.floor}
              onChange={handleDimensionChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="rooms" className="block text-sm font-medium">Numero di stanze</label>
            <input
              id="rooms"
              type="text"
              name="rooms"
              value={dimensions.rooms}
              onChange={handleDimensionChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="energyClass" className="block text-sm font-medium">Classe energetica</label>
            <input
              id="energyClass"
              type="text"
              name="energyClass"
              value={dimensions.energyClass}
              onChange={handleDimensionChange}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Servizi aggiuntivi */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Ascensore</label>
            <input
              type="checkbox"
              name="elevator"
              checked={facilities.elevator}
              onChange={handleFacilityChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Portineria</label>
            <input
              type="checkbox"
              name="concierge"
              checked={facilities.concierge}
              onChange={handleFacilityChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Climatizzazione</label>
            <input
              type="checkbox"
              name="airConditioning"
              checked={facilities.airConditioning}
              onChange={handleFacilityChange}
              className="mt-1"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white p-2 rounded-md"
        >
          Invia
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
