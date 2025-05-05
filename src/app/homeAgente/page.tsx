import TendinaLateraleAgente from "../../components/tendinaLateraleAgente";
import LogoConScritta from "../../components/logoConScritta";
import BarraDiRicercaHomeAgente from "../../components/barraDiRicercaHomeAgente";

export default function HomeAgente() {
  return (
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaLateraleAgente />
      </div>
                
      <div className="flex-1 p-8">
        <LogoConScritta />        

      </div>
  
    </div>
  );
}
