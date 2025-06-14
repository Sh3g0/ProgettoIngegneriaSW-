'use client';
import React, { useState } from 'react';
import '../styles/style.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyPassword, setAgencyPassword] = useState('');
  const [agencyShowPassword, setAgencyShowPassword] = useState(false);

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
        sessionStorage.setItem('token', data.token);
        console.log('Login fatto. Token salvato:', sessionStorage.getItem('token'));

        if (data.user && data.user.ruolo) {
          router.push('/home');
        } else {
          console.log('Ruolo non gestito, resto fermo.');
        }
      }
    } catch (error) {
      console.error('Errore di login:', error);
      alert('Username o password errati.');
    }
  };

  const handleAgencyLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/loginAgenzia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: agencyEmail, password: agencyPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('token', data.token);
        console.log('Login agenzia effettuato:', data.token);
        setShowAgencyModal(false);
        router.push(`/home?primo_accesso=${data.agenzia.primo_accesso ? 'true' : 'false'}&idAgenzia=${data.agenzia.id}`);
      } else {
        alert(data.message || 'Credenziali non valide');
      }
    } catch (err) {
      console.error('Errore login agenzia:', err);
      alert('Errore durante il login dell\'agenzia');
    }
  };

  return (
    <div className="login-container relative">
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
          <input id="username" type="text" placeholder="Inserisci il tuo username" className="login-input" />
        </div>

        <div className="input-group" style={{ position: 'relative' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
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
            {showPassword ? '🙈' : '👁️‍🗨️'}
          </button>
        </div>

        {/* Link Agenzia */}
        <div className="password-options">
          <a
            href="#"
            onClick={() => setShowAgencyModal(true)}
            className="hover:underline text-blue-600"
          >
            Accedi come agenzia
          </a>
        </div>

        <button className="signin-btn" onClick={handleSignIn}>Sign in</button>

        <div className="signup">
          Don’t have an account? <a href="/registrazione">Sign up</a>
        </div>
      </div>

      {/* MODALE AGENZIA */}
      {showAgencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">Login Agenzia</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={agencyEmail}
                onChange={(e) => setAgencyEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type={agencyShowPassword ? 'text' : 'password'}
                value={agencyPassword}
                onChange={(e) => setAgencyPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <button
                className="absolute right-3 top-8 text-gray-600"
                onClick={() => setAgencyShowPassword(p => !p)}
              >
                {agencyShowPassword ? '🙈' : '👁️‍🗨️'}
              </button>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => setShowAgencyModal(false)}
              >
                Annulla
              </button>
              <button
                className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleAgencyLogin}
              >
                Accedi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
