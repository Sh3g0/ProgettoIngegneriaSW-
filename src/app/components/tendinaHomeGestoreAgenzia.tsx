'use client';

import { TrendingUp, User, Home, Pencil, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function TendinaHomeGestoreAgenzia() {
  const icone = [
    { icon: <TrendingUp />, href: '/homeGestore', label: 'Home', attiva: true },
    { icon: <User />, href: '/gestoreProfilo', label: 'Profilo' },
    {
      icon: (
        <div className="relative">
          <Home />
          <Pencil className="absolute -right-2 -bottom-2 h-3 w-3 text-blue-500" />
        </div>
      ),
      href: '/modificaImmobili',
      label: 'Modifica',
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white shadow-lg flex flex-col justify-between items-center py-4">
      <div className="mb-6">
        <Image src="/img/logo.png" alt="Logo" width={60} height={60} />
      </div>

      <div className="flex flex-col items-center space-y-4">
        {icone.map((item, i) => (
          <Link key={i} href={item.href}>
            <div
              className={`p-2 rounded ${
                item.attiva
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <Link href="/aggiungiImmobile">
          <div className="p-2 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition">
            <Plus />
          </div>
        </Link>
      </div>
    </div>
  );
}
