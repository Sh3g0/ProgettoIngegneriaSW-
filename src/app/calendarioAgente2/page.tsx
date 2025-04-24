import CalendarioCompleto from "../components/calendarioCompleto";
import LogoConScrittaCalendario from "../components/logoConScrittaCalendario";
import TendinaLateraleAgenteCalendario from "../components/tendinaLateraleAgenteCalendario";

export default function CalendarioAgente() {
  return (
    <>
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaLateraleAgenteCalendario />
      </div>

      <div className="flex-1 p-8">
        <LogoConScrittaCalendario/>
        <CalendarioCompleto/>
      

      </div>
  
    </div>
    </>
  );
}

