'use client'

import { Pencil, Home } from "lucide-react"
import Form from '@/components/formImmobile'
import Footer from '@/components/Footer'
import BannerAgente from "@/components/BannerAgente"

export default function CaricaImmobile() {
  return (
    <div className="bg-gray-100">
      <div className="min-h-screen w-full">
        {/* Hero Section */}
        <div
          className="relative h-[600px] w-full bg-cover bg-center shadow-xl"
          style={{
            backgroundImage: `url(/img/sfondo7.jpg)`,
            backgroundSize: 'cover'
          }}
        >
          <div className="h-full flex flex-col">
            <div className="sticky top-0 z-50 w-full">
              <BannerAgente />
            </div>
            <div className="mt-32 ml-16 text-white sm:ml-32 lg:ml-64">
              <h1 className="font-bold text-4xl sm:text-5xl leading-tight mb-2">
                Vuoi vendere il tuo <br /> immobile?
              </h1>
              <p className="text-xl">Affidati alla nostra agenzia!</p>
            </div>
          </div>
        </div>

        {/* Sezione principale */}
        <div className="px-6 md:px-12 py-16 flex flex-col gap-12 max-w-4xl mx-auto">
          {/* Box info */}
          <div className="bg-gray-100 p-6 rounded-2xl flex flex-col items-center text-center justify-center">
            <div className="relative mb-4">
              <Home size={72} className="text-gray-700" />
              <Pencil
                size={28}
                className="absolute top-0 right-0 text-gray-700 bg-gray-100 rounded-xl"
              />
            </div>
            <h2 className="text-3xl text-gray-700 font-bold mb-4">
              Carica il tuo immobile
            </h2>
            <p className="text-gray-600 text-md leading-relaxed max-w-md">
              Inserisci tutte le informazioni necessarie per pubblicare l'annuncio.
              <br />
              <strong>Un amministratore controllerà la tua richiesta.</strong>
            </p>
          </div>

          {/* Box form */}
          <div className="bg-white p-6 shadow-lg rounded-2xl">
            <Form />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
