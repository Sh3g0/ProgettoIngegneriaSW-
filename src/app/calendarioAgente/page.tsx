import Link from "next/link";
import LogoConScrittaCalendario from "../components/logoConScrittaCalendario";
import TabellaAppuntamenti from "../components/tabellaAppunatmenti";
import TendinaLateraleAgenteCalendario from "../components/tendinaLateraleAgenteCalendario";

export default function CalendarioAgente() {
  return (
    <>
      <div className="flex min-h-screen">
        <div className="w-20 bg-white shadow-md z-10">
          <TendinaLateraleAgenteCalendario />
        </div>

        <div className="flex-1 p-8">
          <LogoConScrittaCalendario />
          <TabellaAppuntamenti />

          <div className="mt-6">
            <Link href="/calendarioAgente2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
                Visualizza calendario completo
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
