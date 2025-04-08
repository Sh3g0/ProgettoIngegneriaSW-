import React from 'react';
import '../../../public/style.css'; 
import Script from 'next/script';

export default function Login() {
  return (
    <div className="login-container">
      <Script src="/scripts/login.js"></Script>
      <div className="left">
        <img src="img/logo.png" alt="Logo"/>
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
        <input type="text" placeholder="User name or email address" />
        <button className='hide'>👁️‍🗨️</button>
        <input type="password" placeholder="Your password"/>
        <div className="password-options">
          <a href="#">Forgot your password?</a>
        </div>
        <button type="submit" className="signin-btn">Sign in</button>
        <div className="signup">
          Don’t have an account? <a href="#">Sign up</a>
        </div>
      </div>
    </div>
  );
}
