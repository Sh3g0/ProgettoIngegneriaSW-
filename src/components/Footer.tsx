import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo / Descrizione */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">DietiEstates25</h2>
          <p className="text-sm text-gray-400">
            Soluzioni immobiliari su misura. Affidabilità, esperienza e trasparenza al tuo servizio.
          </p>
        </div>

        {/* Link utili */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Link utili</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:underline">Chi siamo</a></li>
            <li><a href="#" className="hover:underline">Immobili</a></li>
            <li><a href="#" className="hover:underline">Contatti</a></li>
            <li><a href="#" className="hover:underline">Lavora con noi</a></li>
          </ul>
        </div>

        {/* Contatti */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contatti</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>Email: info@realestatepro.it</li>
            <li>Tel: +39 0123 456789</li>
            <li>Indirizzo: Via Roma 10, Milano</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Seguici</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FaLinkedin />
            </a>
            <a href="mailto:info@realestatepro.it" className="text-gray-300 hover:text-white">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} DietiEstates25. Tutti i diritti riservati.
      </div>
    </footer>
  );
};

export default Footer;