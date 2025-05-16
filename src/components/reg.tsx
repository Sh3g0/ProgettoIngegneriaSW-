'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Reg() {
  const router = useRouter();
  const [ruolo, setRuolo] = useState<'cliente' | 'agente'>('cliente');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dati per agenzia (solo se ruolo = agente)
  const [nomeAgenzia, setNomeAgenzia] = useState('');
  const [sedeAgenzia, setSedeAgenzia] = useState('');
  const [emailAgenzia, setEmailAgenzia] = useState('');

  const [showAgenziaPopup, setShowAgenziaPopup] = useState(false);

  const handleRegUtente = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, ruolo }),
      });

      if (!res.ok) throw new Error('Registrazione cliente fallita');

      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/login');
    } catch (err) {
      console.error(err);
      setError('Errore durante la registrazione');
    }
  };

  return (
    <div className="flex h-screen">
      {/* SEZIONE SINISTRA */}
      <div
        className="left w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-100 p-8"
        style={{ backgroundImage: 'url(/img/sfondo6.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <img src="/img/logo.png" alt="Logo" className="mb-4" />
        <h1 className="text-4xl font-bold text-center mb-4">DietiEstates25</h1>
        <p className="text-lg text-center text-white-700 mb-6">Dove l’arte incontra l’immobiliare</p>
        <div className="credits text-center text-sm text-gray-500">
          Designed by<br /><b>STICY Tech.</b>
        </div>
      </div>

      {/* SEZIONE DESTRA - FORM DI REGISTRAZIONE */}
      <div className="right w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Sign up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="w-full max-w-md space-y-4">
          {ruolo === 'cliente' && (
            <>
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-base font-semibold mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Inserisci il tuo username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-base font-semibold mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Inserisci la tua email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="block text-base font-semibold mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Inserisci la password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-lg"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? '🙈' : '👁️‍🗨️'}
                </button>
              </div>

              {/* Conferma Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-base font-semibold mb-1">
                  Conferma Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Conferma la password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}


          {/* Ruolo */}
          <div className="text-center mt-4">
            {ruolo === 'cliente' ? (
              <p
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setRuolo('agente')}
              >
                Sei un'agenzia? Clicca qui per creare l'agenzia.
              </p>
            ) : (
              <p
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => setRuolo('cliente')}
              >
                Torna a essere un cliente.
              </p>
            )}
          </div>

          {/* Bottone Registrazione */}
          <button
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={handleRegUtente}
          >
            Registrati
          </button>

          {/* Link per Sign in */}
          <p className="text-center mt-4 text-sm">
            Hai già un account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
      {/* Popup Creazione Agenzia */}
      {showAgenziaPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Creazione Agenzia</h3>
            <div>
              <label htmlFor="nomeAgenziaPopup" className="block text-base font-semibold mb-1">
                Nome Agenzia
              </label>
              <input
                id="nomeAgenziaPopup"
                type="text"
                placeholder="Nome Agenzia"
                value={nomeAgenzia}
                onChange={(e) => setNomeAgenzia(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="sedeAgenziaPopup" className="block text-base font-semibold mb-1">
                Sede
              </label>
              <input
                id="sedeAgenziaPopup"
                type="text"
                placeholder="Sede"
                value={sedeAgenzia}
                onChange={(e) => setSedeAgenzia(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="emailAgenziaPopup" className="block text-base font-semibold mb-1">
                Email Agenzia
              </label>
              <input
                id="emailAgenziaPopup"
                type="email"
                placeholder="Email Agenzia"
                value={emailAgenzia}
                onChange={(e) => setEmailAgenzia(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={() => setShowAgenziaPopup(false)}
              >
                Annulla
              </button>
              <button
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 ml-4"
                 // Aggiungi logica per creare agenzia
              >
                Crea Agenzia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}