'use client';
import React, { useState } from 'react';
import '../styles/style.css'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  const handleSignIn = async () => {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Login fallito');
      }

      const data = await response.json();

      // In base al ruolo, vai alla pagina corretta
      if (data.role === 'cliente') {
        router.push('/homeCliente');
      } else if (data.role === 'agente') {
        router.push('/homeAgente');
      } else if (data.role === 'gestore') {
        router.push('/homeGestoreAgenzia');
      } else {
        //Se il ruolo non è riconosciuto
        alert('Utente non trovato. Per favore, registrati.');
      }
    } catch (error) {
      console.error('Errore di login:', error);
      alert('Username o password errati.');
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
        <h2>Sign in</h2>
        <button className="btn">
          <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
          Continue with Google
        </button>
        <button className="btn">
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" />
          Continue with Facebook
        </button>
        <div className="divider">OR</div>
        Username
        <input id="username" 
          type="text" 
          placeholder="User name or email address"
        />
        <button
          type="button"
          className="hide"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "🙈" : "👁️‍🗨️"}
        </button>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Your password"
        />
        <div className="password-options">
          <a href="#">Forgot your password?</a>
        </div>
        <button id="login" className="signin-btn" onClick={handleSignIn}>Sign in</button>
        <div className="signup">
          Don’t have an account? <a href="/registrazione">Sign up</a>
        </div>
      </div>
    </div>
  );
}
