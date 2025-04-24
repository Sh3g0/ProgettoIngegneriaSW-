'use client'; 

import LogoConScrittaAnalisi from "../components/logoConScrittaAnalisi";
import StatisticheFinali from "../components/statisticheFinali";
import TendinaLateraleAnalisi from "../components/tendinaLateraleAnalisi";
import * as FileSaver from "file-saver"; 
import * as XLSX from "xlsx"; 
import { jsPDF } from "jspdf"; 

export default function AnalisiImmobileAgente() {
  const exportToCSV = () => {
    const data = [
      ["Immobile", "Visite Prenotate", "Offerte Fatte", "Visualizzazioni", "Salvataggi"],
      ["Via Roma 10", 25, 10, 150, 40],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistiche");

    const csvOutput = XLSX.write(wb, { bookType: "csv", type: "array" });

    const blob = new Blob([csvOutput], { type: "text/csv" });
    FileSaver.saveAs(blob, "report_immobile.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Statistiche Immobile: Via Roma 10", 20, 20);
    doc.text("Visite Prenotate: 25", 20, 30);
    doc.text("Offerte Fatte: 10", 20, 40);
    doc.text("Visualizzazioni: 150", 20, 50);
    doc.text("Salvataggi: 40", 20, 60);
    doc.save("report_immobile.pdf");
  };

  const exportToExcel = () => {
    const data = [
      ["Immobile", "Visite Prenotate", "Offerte Fatte", "Visualizzazioni", "Salvataggi"],
      ["Via Roma 10", 25, 10, 150, 40],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistiche");

    XLSX.writeFile(wb, "report_immobile.xlsx");
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-20 bg-white shadow-md z-10">
        <TendinaLateraleAnalisi />
      </div>

      <div className="flex-1 p-8">
        <LogoConScrittaAnalisi />

        <div className="flex flex-wrap gap-8 mt-8">
          <div className="w-full md:w-2/3">
            <StatisticheFinali
              immobile="Via Roma 10"
              foto="https://example.com/foto-immobile.jpg"
              visitePrenotate={25}
              offerteFatte={10}
              visualizzazioni={150}
              salvataggi={40}
            />
          </div>

          <div className="w-full md:w-[400px] flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Esporta Report</h3>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600"
              onClick={exportToPDF}
            >
              Esporta in PDF
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600"
              onClick={exportToCSV}
            >
              Esporta in CSV
            </button>
            <button
              className="bg-orange-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-orange-600"
              onClick={exportToExcel}
            >
              Esporta in Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
