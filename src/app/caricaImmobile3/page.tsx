import DettagliImmobile2 from "../components/dettagliImmobile2";
import Header from "../components/header";

export default function CaricaImmobile3() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      //oi
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <DettagliImmobile2 />
        </div>
      </main>
    </div>
  );
}
