import { TabellaTotPrenCliente } from "@/components/tabellaTotPrenCliente";
import TendinaStoricoCliente from "@/components/tendinaStoricoCliente";
export default function PrenotazioniTotCliente() {
  return (
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaStoricoCliente />
      </div>

      <div className="flex-1 p-8">
        <TabellaTotPrenCliente />
      </div>
    </div>
  );
}
