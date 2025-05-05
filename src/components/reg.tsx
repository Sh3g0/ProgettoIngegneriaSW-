'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Reg() {
  const router = useRouter();
  const [ruolo, setRuolo] = useState<'cliente' | 'agente'>('cliente');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idAgenzia, setIdAgenzia] = useState('');
  const [sedeAgenzia, setSedeAgenzia] = useState('');
  const [nomeAgenzia, setNomeAgenzia] = useState('');
  const [emailAgenzia, setEmailAgenzia] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Funzione per gestire la registrazione
  const handleSignup = async () => {
    setError(''); // Resetta l'errore

    if (password !== confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    if (ruolo === 'agente') {
      const agenziaData = {
        nomeAgenzia,
        sedeAgenzia,
        emailAgenzia,
      };

      try {
        const agenziaResponse = await fetch('http://localhost:3001/api/creazioneAzienda', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agenziaData),
        });

        if (agenziaResponse.ok) {
          const agenzia = await agenziaResponse.json();
          if (agenzia && agenzia.agenziaId) {
            const idAgenziaCreata = agenzia.agenziaId;

            // Ora registriamo l'utente con l'ID dell'agenzia
            const response = await fetch('http://localhost:3001/api/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email,
                username,
                password,
                ruolo,
                idAgenzia: idAgenziaCreata,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('token', data.token); // Salva il token nel localStorage
              router.push('/start');
            } else {
              setError('Registrazione agenzia fallita');
            }
          } else {
            setError('ID agenzia non trovato');
          }
        } else {
          setError('Creazione agenzia fallita');
        }
      } catch (error) {
        console.error(error);
        setError('Errore durante la creazione dell\'agenzia');
      }
    } else {
      // Registrazione cliente
      const response = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, ruolo }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Salva il token nel localStorage
        router.push('/start');
      } else {
        setError('Registrazione fallita');
      }
    }
  };

  // Funzione per aprire/chiudere il pop-up
  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

  // Funzione per creare l'agenzia
  const handleCreazioneAzienda = async () => {
    const data = {
      nome: nomeAgenzia,
      sede: sedeAgenzia,
      email: emailAgenzia,
      id: 1, // solo per test
    };

    if (!nomeAgenzia || !sedeAgenzia || !emailAgenzia) {
      alert('Tutti i campi sono obbligatori per la creazione dell\'agenzia');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/creazioneAzienda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result && result.agenziaId) {
        console.log('Agenzia creata con successo:', result);
        setRuolo('agente');
        setShowPopup(false);
      } else {
        console.error('Creazione agenzia fallita', result);
      }
    } catch (error) {
      console.error('Errore durante la creazione dell\'agenzia', error);
    }
  };

  return (
    <div className="flex h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/img/sfondo.jpg")' }}>
      {/* Sezione sinistra */}
      <div className="flex-1 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
        <img src="/img/logo.png" alt="Logo" className="w-32 h-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-4">DietiEstates25</h1>
        <p className="text-lg text-white mb-4">Dove l’arte incontra l’immobiliare</p>
        <div className="text-gray-300">
          Designed by<br /><b>STICY Tech.</b>
        </div>
      </div>

      {/* Sezione destra */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-6">
        <h2 className="text-3xl font-semibold mb-4">Sign up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          id="username"
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          id="email"
          type="text"
          placeholder="E-mail address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="absolute right-10 top-24 bg-transparent border-none text-2xl">👁️‍🗨️</button>

        <input
          id="password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mb-4">
          <a href="#" onClick={handlePopup} className="text-blue-500 hover:underline">Sei un'agenzia?</a>
        </div>

        <button
          id="signup"
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700"
          onClick={handleSignup}
        >
          Sign up
        </button>

        <div className="mt-4 text-sm">
          Already have an account? <a href="/" className="text-blue-500 hover:underline">Sign in</a>
        </div>
      </div>

      {/* Pop-up per la creazione dell'agente */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Registrazione Agente</h3>
            <label className="block text-lg font-medium mb-2">Nome Agenzia</label>
            <input
              type="text"
              placeholder="Nome agenzia"
              value={nomeAgenzia}
              onChange={(e) => setNomeAgenzia(e.target.value)}
              className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-lg font-medium mb-2">Sede Agenzia</label>
            <input
              type="text"
              placeholder="Sede agenzia"
              value={sedeAgenzia}
              onChange={(e) => setSedeAgenzia(e.target.value)}
              className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-lg font-medium mb-2">Email Agenzia</label>
            <input
              type="email"
              placeholder="Email agenzia"
              value={emailAgenzia}
              onChange={(e) => setEmailAgenzia(e.target.value)}
              className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 mb-2"
              onClick={handleCreazioneAzienda}
            >
              Crea Agenzia
            </button>

            <button
              className="w-full bg-red-600 text-white p-4 rounded-lg font-semibold hover:bg-red-700"
              onClick={handlePopup}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
