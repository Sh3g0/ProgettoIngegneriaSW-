'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJwtPayload } from '@/components/useJwtPayload';

export default function UserProfile() {
  const router = useRouter();
  const payload = useJwtPayload();

  useEffect(() => {
    console.log('Payload:', payload);

    if (payload === null) {
      // ancora loading o non presente, attendi
      return;
    }

    if (!payload || payload.ruolo.toLowerCase() === 'cliente') {
      router.push('/login');
    }
  }, [payload, router]);

  if (payload === null) {
    return <div className="p-6">Caricamento profilo...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Profilo Utente</h2>

      <div className="mb-4">
        <strong>Username:</strong> {payload.username}
      </div>

      <div className="mb-4">
        <strong>Ruolo:</strong> {payload.ruolo}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/home');
        }}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
