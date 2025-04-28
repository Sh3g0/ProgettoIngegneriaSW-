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
      <Script src="/scripts/login.js"></Script>
      <div className="left">
        <img src="/img/logo.png" alt="Logo"/> 
        <h1>DietiEstates25</h1>
        <p>Dove l’arte incontra l’immobiliare</p>
        <div className="credits">
          Designed by<br /><b>STICY Tech.</b>
        </div>
      </div>
      <div className="right">
        <h2>Sign in</h2>
        <button className="btn">
          <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
          Continue with Google
        </button>
        <button className="btn">
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" />
          Continue with Facebook
        </button>
        <div className="divder">OR</div>
        <input id="username" type="text" placeholder="User name or email address" />
        <button className='hide'>👁️‍🗨️</button>
        <input id="password" type="password" placeholder="Your password"/>
        <div className="password-options">
          <a href="#">Forgot your password?</a>
        </div>
        <button id="login" className="signin-btn">Sign in</button>
        <div className="signup">
          Don’t have an account? <Link href="/registrazione">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

