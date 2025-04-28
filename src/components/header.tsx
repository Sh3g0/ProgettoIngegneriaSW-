'use client';
import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md p-4 flex items-center ">
      <img src="/img/logo.png" alt="Logo" className="h-20 w-20 mr-4" />
      <h1 className="text-5xl font-bold text-gray-800">DietiEstates25</h1>
    </header>
  );
}
