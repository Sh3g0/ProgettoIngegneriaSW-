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
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvo il token
        localStorage.setItem('token', data.token);
        console.log('Login fatto. Token salvato:', data.token);

        // Controllo il ruolo
        if (data.user && data.user.ruolo !== undefined) {
          router.push('/homeCliente');
        } else {
          console.log('Ruolo non specificato, resto fermo.');
        }
      } else {
        throw new Error(data.message || 'Login fallito');
      }
    } catch (error) {
      console.error('Errore di login:', error);
      alert('Username o password errati.');
    }
  };

  return (
    <div className="login-container">
      <div className="left justify-center mt-32">
        <img src="/img/logo_prova.png" alt="Logo" />
        <div className="credits">
          Designed by<br /><b>STICY Tech.</b>
        </div>
      </div>

      <div className="right">
        <h2>Sign in</h2>

        {/* Login Google */}
        <button className="btn" onClick={() => window.location.href = 'http://localhost:3001/auth/google'}>
          <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
          Continue with Google
        </button>

        {/* Login Facebook */}
        <button className="btn" onClick={() => window.location.href = 'http://localhost:3001/auth/facebook'}>
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" />
          Continue with Facebook
        </button>

        <div className="divider">OR</div>

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Inserisci il tuo username"
            className="login-input"
          />
        </div>

        <div className="input-group" style={{ position: 'relative' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Inserisci la tua password"
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

        <div className="password-options">
          <a href="#">Forgot your password?</a>
        </div>

        <button className="signin-btn" onClick={handleSignIn}>Sign in</button>

        <div className="signup">
          Don’t have an account? <a href="/registrazione">Sign up</a>
        </div>
      </div>
    </div>
  );
}
