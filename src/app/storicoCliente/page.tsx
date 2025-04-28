import { ImmobiliVisualizzatiCliente } from "@/components/immobiliVisualizzatiCliente";
import LogoConScrittaRiepilogoCliente from "@/components/logoConScrittaRiepilogoCliente";
import { OfferteFatteCliente } from "@/components/offerteFatteCliente";
import TendinaStoricoCliente from "@/components/tendinaStoricoCliente";
import { VisitePrenotateCliente } from "@/components/visitePrenotateCliente";

export default function TrackingOfferte() {
  return (
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaStoricoCliente />
      </div>

      <div className="flex-1 p-8">
        <LogoConScrittaRiepilogoCliente />
        <ImmobiliVisualizzatiCliente />
        <OfferteFatteCliente />
        <VisitePrenotateCliente />

      </div>
    </div>
  );
}
