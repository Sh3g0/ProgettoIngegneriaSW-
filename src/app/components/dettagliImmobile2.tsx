'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DettagliImmobile2() {
    const router = useRouter();

    const [dati, setDati] = useState({
        mq: 1,
        piano: "",
        stato: "",
        camereDaLetto: 1,
        classeEnergetica: "",
        prezzo: "",
    });

    const [features, setFeatures] = useState({
        portineria: null,
        terrazzo: null,
        balcone: null,
        garage: null,
        giardino: null,
        ascensore: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDati(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateFeature = (feature, value) => {
        setFeatures(prev => ({
            ...prev,
            [feature]: value,
        }));
    };

    const handleRiepilogo = () => {
        router.push("/riepilogo");
    };

    const handleIndietro = () => {
        router.back()
        ; 
    };

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 space-y-10">

            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Indica le caratteristiche dell'immobile</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Superficie (mq)</label>
                        <input
                            type="number"
                            name="mq"
                            min="1"
                            className="w-full border p-2 rounded"
                            value={dati.mq}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Piano</label>
                        <input
                            type="number"
                            name="piano"
                            min="0"
                            className="w-full border p-2 rounded"
                            value={dati.piano}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stato dell'immobile</label>
                        <select
                            name="stato"
                            className="w-full border p-2 rounded"
                            value={dati.stato}
                            onChange={handleChange}
                        >
                            <option value="">Seleziona</option>
                            <option>Nuovo</option>
                            <option>In costruzione</option>
                            <option>Ottimo</option>
                            <option>Ristrutturato</option>
                            <option>Buono</option>
                            <option>Abitabile</option>
                            <option>Da ristrutturare</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Numero di Camere da Letto</label>
                        <input
                            type="number"
                            name="camereDaLetto"
                            min="0"
                            className="w-full border p-2 rounded"
                            value={dati.camereDaLetto}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Classe Energetica</label>
                        <input
                            type="text"
                            name="classeEnergetica"
                            className="w-full border p-2 rounded"
                            value={dati.classeEnergetica}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Prezzo (€)</label>
                        <input
                            type="number"
                            name="prezzo"
                            min="0"
                            className="w-full border p-2 rounded"
                            value={dati.prezzo}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* DESTRA - Extra */}
                <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Extra</h3>

                    {Object.entries(features).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{key}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => updateFeature(key, true)}
                                    className={`px-4 py-1 rounded font-semibold ${value === true ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
                                >
                                    Sì
                                </button>
                                <button
                                    onClick={() => updateFeature(key, false)}
                                    className={`px-4 py-1 rounded font-semibold ${value === false ? "bg-red-500 text-white" : "bg-gray-300 text-black"}`}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <button 
                    onClick={handleIndietro}
                    className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded hover:bg-gray-400"
                >
                    Indietro
                </button>

                <button 
                    onClick={handleRiepilogo}
                    className="bg-[#8B0000] text-white font-bold py-2 px-6 rounded hover:bg-red-700"
                >
                    Avanti
                </button>
            </div>
        </div>
    );
}
