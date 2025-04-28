'use client';
import React, { useState } from 'react';
import '../styles/style.css';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      <div className="left">
        <img src="/img/logo.png" alt="Logo"/> 
        <h1>DietiEstates25</h1>
        <p>Dove l’arte incontra l’immobiliare</p>
        <div className="credits">
          Designed by<br /><b>STICY Tech.</b>
        </div>
      </div>
      <div className="right">
        <h2>Sign up</h2>
        <input id="username" type="text" placeholder="Your username" />
        <input id="email" type="text" placeholder="E-mail address" />
        <button className='hide'>👁️‍🗨️</button>
        <input id="password" type="password" placeholder="Your password"/>
        <input id="confirmPassword" type="password" placeholder="Confirm password"/>
        <div className="password-options">
          <a href="#">Sei un'agenzia?</a>
        </div><button id="signup" type='submit' className="signin-btn">Sign up</button>
        <div className="signup">
          Already have an account? <a href="/">Sign in</a>
        </div>
      </div>
    </div>
  );
}

