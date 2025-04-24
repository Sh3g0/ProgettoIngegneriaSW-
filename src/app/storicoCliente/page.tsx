import { ImmobiliVisualizzatiCliente } from "@/app/components/immobiliVisualizzatiCliente";
import LogoConScrittaRiepilogoCliente from "@/app/components/logoConScrittaRiepilogoCliente";
import { OfferteFatteCliente } from "@/app/components/offerteFatteCliente";
import TendinaStoricoCliente from "@/app/components/tendinaStoricoCliente";
import { VisitePrenotateCliente } from "@/app/components/visitePrenotateCliente";

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
