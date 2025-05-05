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

  const handleSignup = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    if (ruolo === 'agente') {
      try {
        const agenziaRes = await fetch('http://localhost:3001/api/creazioneAzienda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nomeAgenzia,
            sedeAgenzia,
            emailAgenzia
          }),
        });

        if (!agenziaRes.ok) throw new Error('Creazione agenzia fallita');
        const { agenziaId } = await agenziaRes.json();

        const userRes = await fetch('http://localhost:3001/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password, ruolo, idAgenzia: agenziaId }),
        });

        if (!userRes.ok) throw new Error('Registrazione utente fallita');

        const data = await userRes.json();
        localStorage.setItem('token', data.token);
        router.push('/start');
      } catch (err) {
        console.error(err);
        setError('Errore durante la registrazione come agente');
      }

    } else {
      try {
        const res = await fetch('http://localhost:3001/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password, ruolo }),
        });

        if (!res.ok) throw new Error('Registrazione cliente fallita');

        const data = await res.json();
        localStorage.setItem('token', data.token);
        router.push('/start');
      } catch (err) {
        console.error(err);
        setError('Errore durante la registrazione');
      }
    }
  };

  return (<div className="flex h-screen">
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
  
        {/* Ruolo */}
        <div>
          <label className="block text-base font-semibold mb-1">Ruolo</label>
          <select
            value={ruolo}
            onChange={(e) => setRuolo(e.target.value as 'cliente' | 'agente')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cliente">Cliente</option>
            <option value="agente">Agente</option>
          </select>
        </div>
  
        {/* Se ruolo è agente, mostra campi extra */}
        {ruolo === 'agente' && (
          <>
            <div>
              <label htmlFor="nomeAgenzia" className="block text-base font-semibold mb-1">
                Nome Agenzia
              </label>
              <input
                id="nomeAgenzia"
                type="text"
                placeholder="Inserisci il nome dell'agenzia"
                value={nomeAgenzia}
                onChange={(e) => setNomeAgenzia(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            <div>
              <label htmlFor="sedeAgenzia" className="block text-base font-semibold mb-1">
                Sede
              </label>
              <input
                id="sedeAgenzia"
                type="text"
                placeholder="Inserisci la sede"
                value={sedeAgenzia}
                onChange={(e) => setSedeAgenzia(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            <div>
              <label htmlFor="emailAgenzia" className="block text-base font-semibold mb-1">
                Email Agenzia
              </label>
              <input
                id="emailAgenzia"
                type="email"
                placeholder="Email dell'agenzia"
                value={emailAgenzia}
                onChange={(e) => setEmailAgenzia(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}
  
        {/* Bottone Registrazione */}
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          onClick={handleSignup}
        >
          Registrati
        </button>
  
        {/* Link per Sign in */}
        <p className="text-center mt-4 text-sm">
          Hai già un account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  </div>
  
  );
}
