'use client'

import { Pencil, Home } from "lucide-react"

import Banner from '@/components/Banner'
import Form from '@/components/formImmobile'
import Footer from '@/components/Footer'

export default function caricaImmobile(){
    return(
        <div className="bg-gray-100">
            <div className="w-full min-h-screen">
            {/* Hero Section */}
                <div
                    className="relative w-full h-[600px] bg-cover bg-center shadow-xl"
                    style={{
                        backgroundImage: `url(/img/sfondo7.jpg)`,
                        backgroundSize: 'cover'
                    }}          
                >
                    <div className='min-h-screen'>
                        <div className='sticky top-0 z-50 w-full border-none'>
                            < Banner />
                        </div>
                        <div className='mt-32 ml-64 text-white'>
                            <div className='font-bold text-5xl'>
                                <p>Vuoi vendere il tuo</p>
                                immobile?
                            </div>
                            <div className='text-xl'>
                                Affidati alla nostra agenzia!
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-row gap-8 bg-gray-100 mt-16 w-[90%] mx-auto">
                {/* Colonna 1: testo, immagine, invito all'azione, ecc. */}
                    <div className="w-[45%] bg-gray-100 p-4 rounded-2xl flex flex-col items-start text-left ml-16">
                        <div className="flex items-center mb-4">
                            {/* Icona della casa con la matita */}
                            <div className="relative">
                            <Home size={64} className="text-gray-700 z-10" />
                            <Pencil size={32} className="absolute top-0 right-0 text-gray-700 z-30 bg-gray-100 rounded-xl" />
                            </div>
                            <h2 className="text-4xl text-gray-700 font-semibold ml-4">Carica il tuo immobile</h2>
                        </div>

                        <div className="w-full">
                            <p className="text-gray-600 text-md">
                            Inserisci tutte le informazioni necessarie per pubblicare l'annuncio<br />
                            <b>Un amministratore controllerà la tua richiesta</b>
                            </p>
                        </div>
                        </div>


                    {/* Colonna 2: il form */}
                    <div className="w-[55%] mr-16">
                        <Form />
                    </div>
                </div>


                <Footer/>
            </div>
        </div>
    )
}