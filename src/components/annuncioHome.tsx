import React from 'react';
import Link from 'next/link';

type AnnuncioHomeProps = {
  nome: string;
  prezzo: number;
  immagine: string;
  linkDettagli: string;
};

export default function AnnuncioHome({ nome, prezzo, immagine, linkDettagli }: AnnuncioHomeProps) {
  return (
    <div className="flex bg-black text-white border border-blue-500 rounded-md overflow-hidden shadow-md max-w-md">
      <img src={immagine} alt={nome} className="w-1/2 object-cover" />
      
      <div className="p-4 flex flex-col justify-between w-1/2">
        <div>
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold mb-2 inline-block">
            {nome}
          </span>
          <p className="mt-2">PREZZO: <span className="font-bold">{prezzo}$</span></p>
        </div>
        <Link href={linkDettagli} className="text-blue-400 hover:underline mt-4 text-sm">
          dettagli
        </Link>
      </div>
    </div>
  );
}
