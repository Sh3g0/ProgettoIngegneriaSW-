import { ImmobiliVisualTot } from "../components/immobiliVisualTot";
import TendinaStoricoCliente from "../components/tendinaStoricoCliente";

export default function ImmobiliVisualizzatiClnt() {
  return (
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaStoricoCliente />
      </div>

      <div className="flex-1 p-8">
        <ImmobiliVisualTot />
      </div>
    </div>
  );
}
