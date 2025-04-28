import BarraDiRicercaCliente from "../../components/barraDiRicercaCliente";
import LogoConScritta from "../../components/logoConScritta";
import TendinaHomeCliente from "../../components/tendinaHomeCliente";


export default function HomeCliente() {
  return (
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaHomeCliente/>
      </div>

      <div className="flex-1 p-8">
        <LogoConScritta/>

        <BarraDiRicercaCliente/>

        

      </div>
  
    </div>
  );
}
