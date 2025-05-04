'use client';

import { User, Home, History } from 'lucide-react';
import Link from 'next/link';

export default function TendinaHomeCliente() {
  const icone = [
    { icon: <User size={32}/>, href: '/homeCliente', attiva: true },
    { icon: <Home size={32}/>, href: '/offerteCliente' },
    { icon: <History size={32}/>, href: '/storicoCliente' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-24 bg-white shadow-lg flex flex-col justify-between items-center py-4">
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
    </div>
  );
}
