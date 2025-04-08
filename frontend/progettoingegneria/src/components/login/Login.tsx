import React from 'react';
import Script from 'next/script';

export default function Login() {
  return (
    <div className="w-screen h-screen flex">
      <Script src="/scripts/login.js" />
      
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        <img src="img/logo.png" alt="Logo" className="w-32 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">DietiEstates25</h1>
        <p className="text-gray-600 text-center">Dove l’arte incontra l’immobiliare</p>
        <div className="mt-10 text-center text-sm text-gray-500">
          Designed by<br /><b>STICY Tech.</b>
        </div>
      </div>

      <div className="w-1/2 bg-gray-100 flex flex-col justify-center items-center p-8">
        <h2 className="text-2xl font-semibold mb-6">Sign in</h2>

        <button className="btn flex items-center gap-2 bg-white px-4 py-2 rounded shadow mb-3">
          <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <button className="btn flex items-center gap-2 bg-white px-4 py-2 rounded shadow mb-6">
          <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" className="w-5 h-5" />
          Continue with Facebook
        </button>

        <div className="divider my-4 text-gray-400">OR</div>

        <input 
          type="text" 
          placeholder="User name or email address"
          className="w-full max-w-md mb-3 px-4 py-2 border border-gray-300 rounded"
        />

        <div className="relative w-full max-w-md mb-3">
          <input 
            type="password" 
            placeholder="Your password"
            className="w-full px-4 py-2 border border-gray-300 rounded pr-10"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">👁️‍🗨️</button>
        </div>

        <div className="w-full max-w-md text-right mb-4">
          <a href="#" className="text-sm text-blue-500 hover:underline">Forgot your password?</a>
        </div>

        <button 
          type="submit" 
          className="signin-btn bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full max-w-md mb-4"
        >
          Sign in
        </button>

        <div className="signup text-sm">
          Don’t have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
