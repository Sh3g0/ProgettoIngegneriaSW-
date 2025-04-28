'use client';
import React, { useState } from 'react';
import '../styles/style.css';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function Reg() {
  const router = useRouter();
  const [ruolo, setRuolo] = useState<'cliente' | 'agente'>('cliente');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idAgenzia, setId] = useState('');


  // Funzione per gestire la registrazione
  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/registrazione", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
          ruolo: ruolo,
          idAgenzia: idAgenzia
        }),
      });

      if (response.ok) {
        const newPost = await response.json();
        console.log('Registrazione avvenuta con successo:', newPost);
        router.push("/start");
      } else {
        console.error('Registrazione fallita');
      }
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <div className="login-container">
      <Script src="/scripts/registrazione.js"></Script>

      {/* Sinistra */}
      <div className="left">
        <img src="/img/logo.png" alt="Logo" />
        <h1>DietiEstates25</h1>
        <p>Dove l’arte incontra l’immobiliare</p>
        <div className="credits">
          Designed by<br /><b>STICY Tech.</b>
        </div>
      </div>

      {/* Destra */}
      <div className="right">
        <h2>Registrati</h2>

        {/* Input per username, email e password */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className='hide'>👁️‍🗨️</button>
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Scelta Cliente / Agente */}
        <div className="ruolo-selection">
          <p>Registrati come:</p>
          <div className="ruolo-buttons">
            <button
              type="button"
              onClick={() => setRuolo('cliente')}
              className={`ruolo-btn ${ruolo === 'cliente' ? 'selected' : ''}`}
            >
              Cliente
            </button>
            <button
              type="button"
              onClick={() => setRuolo('agente')}
              className={`ruolo-btn ${ruolo === 'agente' ? 'selected' : ''}`}
            >
              Agente Immobiliare
            </button>
          </div>
        </div>

        <button onClick={handleSignup} className="signin-btn">Registrati</button>

        <div className="signup">
          Hai già un account? <a href="/start">Accedi</a>
        </div>
      </div>
    </div>
  );
}