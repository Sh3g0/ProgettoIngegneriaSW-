'use client';
import React, { useState } from 'react';
import '../styles/style.css';
import { useRouter } from 'next/navigation';

export default function Reg() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAgenziaPopup, setShowAgenziaPopup] = useState(false);

  // Dati agenzia
  const [nomeAgenzia, setNomeAgenzia] = useState('');
  const [sedeAgenzia, setSedeAgenzia] = useState('');
  const [emailAgenzia, setEmailAgenzia] = useState('');
  const [descrizioneAgenzia, setDescrizioneAgenzia] = useState('');

  const handleRegUtente = async () => {
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Tutti i campi sono obbligatori');
      return;
    }

    if (password !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, ruolo: 'cliente' }),
      });

      if (!res.ok) throw new Error('Registrazione cliente fallita');

      const data = await res.json();
      sessionStorage.setItem('token', data.token);
      router.push('/login');
    } catch (err) {
      console.error(err);
      setError('Errore durante la registrazione');
    }
  };

  const handleAgenziaSubmit = async () => {
    // Qui va inserita la logica di invio al backend
    console.log({
      nomeAgenzia,
      sedeAgenzia,
      emailAgenzia,
      descrizioneAgenzia,
    });
    setShowAgenziaPopup(false); // Chiudi popup dopo invio

    const res = await fetch('http://localhost:3001/api/registrazioneAgenzia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomeAgenzia, sedeAgenzia, emailAgenzia, descrizioneAgenzia }),
    });

    if (!res.ok) throw new Error('Invio fallito');
    router.push('/login');
    window.alert("Richiesta inviata!");
  }

  return (
    <div className="login-container">
      <div className="left justify-center mt-32">
        <img src="/img/logo_prova.png" alt="Logo" />
        <div className="credits">
          Designed by<br /><b>STICY Tech.</b>
        </div>
      </div>

      <div className="right">
        <h2>Sign up</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Inserisci il tuo username"
            className="login-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Inserisci la tua email"
            className="login-input"
          />
        </div>

        <div className="input-group" style={{ position: 'relative' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Inserisci la tua password"
            className="login-input"
          />
        </div>

        <div className="input-group" style={{ position: 'relative' }}>
          <label htmlFor="confirmPassword">Conferma password</label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ripeti la tua password"
            className="login-input"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(prev => !prev)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '36px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            {showPassword ? "🙈" : "👁️‍🗨️"}
          </button>
        </div>

        {/* Link popup agenzia */}
        <div className="agenzia-link" style={{ marginTop: '1rem' }}>
          <a
            onClick={() => setShowAgenziaPopup(true)}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sei un'agenzia immobiliare? Clicca qui
          </a>
        </div>

        <button className="signin-btn" onClick={handleRegUtente}>Sign up</button>

        <div className="signup">
          Already have an account? <a href="/login">Sign in</a>
        </div>
      </div>

      {/* Popup agenzia */}
      {showAgenziaPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Registrazione agenzia immobiliare</h3><br />
            <div className="input-group">
              <label>Nome agenzia</label>
              <input
                type="text"
                value={nomeAgenzia}
                onChange={(e) => setNomeAgenzia(e.target.value)}
                placeholder="Nome agenzia"
              />
            </div>
            <div className="input-group">
              <label>Sede</label>
              <input
                type="text"
                value={sedeAgenzia}
                onChange={(e) => setSedeAgenzia(e.target.value)}
                placeholder="Città, indirizzo..."
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={emailAgenzia}
                onChange={(e) => setEmailAgenzia(e.target.value)}
                placeholder="Email dell'agenzia"
              />
            </div>
            <div className="input-group">
              <label>Descrizione</label>
              <textarea
                value={descrizioneAgenzia}
                onChange={(e) => setDescrizioneAgenzia(e.target.value)}
                placeholder="Breve descrizione"
                className="w-full h-20 resize-none border border-gray-300 rounded px-2 py-1"
              ></textarea>
            </div>
            <div className="popup-actions">
              <button
                onClick={() => setShowAgenziaPopup(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-red-100 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleAgenziaSubmit}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-blue-100 transition-colors"
              >
                Invia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
