import React, { useState } from "react";
import FormIndirizzo from "@/components/formIndirizzo";

interface Indirizzo {
  streetAddress: string;
  houseNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  lat?: number | null;
  lng?: number | null;
}

interface ImmobileData {
  titolo: string;
  descrizione: string;
  prezzo: string | number | "";
  dimensione_mq: number | "";
  piano: number | "";
  stanze: number | "";
  ascensore: boolean;
  classe_energetica: string;
  portineria: boolean;
  climatizzazione: boolean;
  tipo_annuncio: string;
  vicino_scuole: boolean;
  vicino_parchi: boolean;
  vicino_trasporti: boolean;
  indirizzo: Indirizzo | null;
  immagini: File[] | null;
}

const tipiAnnuncio = [
  "Vendita",
  "Affitto",
];

const classeEnergetica = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
  ];

const FloatingInput: React.FC<{
    id: string;
    name: string;
    type?: string;
    value: any;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    placeholder: string;
    textarea?: boolean;
    selectOptions?: string[];
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  }> = ({
    id,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    textarea = false,
    selectOptions,
    onKeyDown,
  }) => {
    return (
      <div className="relative w-full">
        {textarea ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder=" "
            rows={4}
            className="peer block w-full rounded-xl bg-gray-300 px-3 pt-6 pb-2 text-black
              focus:bg-white focus:text-black focus:border-2 focus:outline-none
              resize-none"
          />
        ) : selectOptions ? (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className="peer block w-full rounded-xl bg-gray-300 px-3 pt-6 pb-2 text-black
              focus:bg-white focus:text-black focus:border-2 focus:outline-none"
          >
            {selectOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder=" "
            className="peer block w-full rounded-xl bg-gray-300 px-3 pt-6 pb-2 text-black
              focus:bg-white focus:text-black focus:border-2 focus:outline-none"
          />
        )}
  
        <label
          htmlFor={id}
          className="absolute left-3 top-2 text-gray-600 text-sm pointer-events-none
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
            peer-focus:top-0 peer-focus:text-gray-500 transition-all"
        >
          {placeholder}
        </label>
      </div>
    );
  };
  

const FormImmobile: React.FC = () => {
  const [data, setData] = useState<ImmobileData>({
    titolo: "",
    descrizione: "",
    prezzo: "",
    dimensione_mq: "",
    piano: "",
    stanze: "",
    ascensore: false,
    classe_energetica: "",
    portineria: false,
    climatizzazione: false,
    tipo_annuncio: "",
    vicino_scuole: false,
    vicino_parchi: false,
    vicino_trasporti: false,
    indirizzo: null,
    immagini: []
  });

  const [showSummary, setShowSummary] = useState(false);
  const [formError, setFormError] = useState(true);

  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState(false);


  const validateForm = (): boolean => {
    const requiredFields = [
      data.titolo,
      data.descrizione,
      data.prezzo,
      data.dimensione_mq,
      data.piano,
      data.stanze,
      data.classe_energetica,
      data.tipo_annuncio,
      data.indirizzo?.streetAddress,
      data.indirizzo?.houseNumber,
      data.indirizzo?.city,
      data.indirizzo?.province,
      data.indirizzo?.postalCode,
      data.indirizzo?.country,
    ];

    console.log(requiredFields);

    const allFilled = requiredFields.every((field) => field !== "" && field !== null && field !== undefined);
  
    if (!allFilled) {
      alert("Per favore compila tutti i campi obbligatori prima di continuare.");
      setFormError(true);
      return false;
    }

    if (images.length === 0) {
      setImageError(true);
      setFormError(true);
      alert("Per favore carica almeno un'immagine.");
      return false;
    }
  
    setImageError(false);
    setFormError(false);
    return true;
  };
  

  const handleSubmit = () => {
    const formData = new FormData();
  
    // aggiungi dati immobile (stringify gli oggetti complessi)
    formData.append("data", JSON.stringify(data));
  
    // aggiungi immagini
    images.forEach((file, index) => {
      formData.append("images", file);
    });
  
    console.log(formData);
    //ora quando chiamo l'api posso inviare direttamente formData senza stringify
  };
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let val: string | boolean = value;

    if (type === "checkbox") {
      val = (e.target as HTMLInputElement).checked;
    }

    setData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const formatPrice = (value: string | number) => {
    if (value === "") return "";
    const number = typeof value === "string" ? parseInt(value.replace(/\./g, ""), 10) : value;
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("it-IT").format(number);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    setData((prev) => ({ ...prev, prezzo: rawValue }));
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleAddressChange = (indirizzo: Indirizzo | null) => {
    setData((prev) => ({
      ...prev,
      indirizzo,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Inserisci dati immobile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grid grid-cols-10 gap-6 col-span-3">
          <div className="col-span-7 text-xl">
            <FloatingInput
              id="titolo"
              name="titolo"
              value={data.titolo}
              onChange={handleChange}
              placeholder="Titolo"
            />
          </div>

          <div className="col-span-3">
          <select
              id="tipo_annuncio"
              name="tipo_annuncio"
              value={data.tipo_annuncio}
              onChange={(e) => {
                setData((prevData) => ({
                  ...prevData,
                  tipo_annuncio: e.target.value,
                }));
                console.log(e.target.value); // Mostra valore corretto
              }}
              style={{ position: "relative", zIndex: 10 }}
              className="w-full h-[70%] border border-gray-300 mt-3 rounded-xl p-2"
            >
              <option value="" disabled hidden>Vendita</option>
              {tipiAnnuncio.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-3">
          <FloatingInput
            id="descrizione"
            name="descrizione"
            value={data.descrizione}
            onChange={handleChange}
            placeholder="Descrizione"
            textarea
          />
        </div>

        <div>
          <FloatingInput
            id="prezzo"
            name="prezzo"
            value={formatPrice(data.prezzo)}
            onChange={handlePriceChange}
            placeholder={data.tipo_annuncio == 'Affitto' ? 'Prezzo (€) al mese' : 'Prezzo (€)'}
            onKeyDown={handleNumberKeyDown}
          />
        </div>

        <div>
          <FloatingInput
            id="dimensione_mq"
            name="dimensione_mq"
            type="number"
            value={data.dimensione_mq}
            onChange={handleChange}
            placeholder="Dimensione (mq)"
            onKeyDown={handleNumberKeyDown}
          />
        </div>

        <div>
          <FloatingInput
            id="piano"
            name="piano"
            type="number"
            value={data.piano}
            onChange={handleChange}
            placeholder="Piano"
            onKeyDown={handleNumberKeyDown}
          />
        </div>

        <div className="mx-[50%] w-full">
          <FloatingInput
            id="stanze"
            name="stanze"
            type="number"
            value={data.stanze}
            onChange={handleChange}
            placeholder="Stanze"
            onKeyDown={handleNumberKeyDown}
          />
        </div>

        <div className="mx-[50%] w-full">
            <select
              id="classe_energetica"
              name="classe_energetica"
              value={data.classe_energetica}
              style={{ position: "relative", zIndex: 10 }}
              onChange={(e) => setData({ ...data, classe_energetica: e.target.value })}
              className="w-full h-[75%] border border-gray-300 mt-3 rounded-xl p-2"
            >
              <option value="" disabled hidden>Classe energetica</option>
              {classeEnergetica.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
        </div>

        {/* Form Indirizzo */}
        <div className="col-span-3 border-2 rounded-2xl p-4">
          <FormIndirizzo onAddressChange={handleAddressChange} />
          {data.indirizzo && (
            <div className="mt-2 text-sm text-gray-700">
              <p>
                {data.indirizzo.streetAddress} {data.indirizzo.houseNumber}, {data.indirizzo.postalCode} {data.indirizzo.city} ({data.indirizzo.province}), {data.indirizzo.country}
              </p>
            </div>
          )}
        </div>

        {/* Upload immagini */}
        <div className="col-span-3">
          <h3 className="text-lg font-semibold mb-2">Carica immagini</h3>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Nota:</strong> la <span className="underline">prima immagine</span> che carichi sarà considerata come{" "}
            <strong>immagine principale</strong> dell&apos;immobile.
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setImages(Array.from(files));
                setImageError(false); // reset errore se caricate
                console.log("Immagini selezionate:", files);
              }
            }}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />

        </div>

        {/* Booleani checkbox */}
        <label className="mx-2">Info agg.</label>
        <div className="-my-4 col-span-3 flex justify-center gap-32 border-2 rounded-2xl mb-1">
          <div className="col-span-3 md:col-span-1">
            <div className="grid grid-cols-2 grid-rows-2 gap-2 items-center justify-items-center">
              <label className="inline-flex items-center space-x-2 col-start-1 row-start-1">
                <input
                  type="checkbox"
                  name="ascensore"
                  checked={data.ascensore}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Ascensore</span>
              </label>

              <label className="inline-flex items-center space-x-2 col-start-2 row-start-1">
                <input
                  type="checkbox"
                  name="portineria"
                  checked={data.portineria}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Portineria</span>
              </label>

              <label className="inline-flex items-center space-x-2 col-span-2 row-start-2 justify-self-center">
                <input
                  type="checkbox"
                  name="climatizzazione"
                  checked={data.climatizzazione}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Climatizzazione</span>
              </label>
            </div>
          </div>

          <div className="col-span-3 md:col-span-1">
            <div className="grid grid-cols-2 grid-rows-2 gap-2 items-center justify-items-center">
              <label className="inline-flex items-center space-x-2 col-start-1 row-start-1">
                <input
                  type="checkbox"
                  name="vicino_scuole"
                  checked={data.vicino_scuole}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="whitespace-nowrap">Vicino scuole</span>
              </label>

              <label className="inline-flex items-center space-x-2 col-start-2 row-start-1">
                <input
                  type="checkbox"
                  name="vicino_parchi"
                  checked={data.vicino_parchi}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="whitespace-nowrap">Vicino parchi</span>
              </label>

              <label className="inline-flex items-center space-x-2 col-span-2 row-start-2 justify-self-center">
                <input
                  type="checkbox"
                  name="vicino_trasporti"
                  checked={data.vicino_trasporti}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="whitespace-nowrap">Vicino trasporti</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottone "Invia" per mostrare il riepilogo */}
        <div className="col-span-3 flex justify-end">
        <button
            onClick={() => {
                if (validateForm()) {
                    setShowSummary(true);
                }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
            Rivedi i dati
        </button>
        </div>

        {/* Riepilogo + conferma invio */}
        {!formError && showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-2xl max-w-2xl w-full shadow-lg relative">
            {/* Pulsante chiudi */}
            <button
                onClick={() => setShowSummary(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg font-bold"
            >
                ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center">Riepilogo dati immobile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800 max-h-[400px] overflow-y-auto pr-2">
                <p><strong>Titolo:</strong> {data.titolo}</p>
                <p><strong>Tipo annuncio:</strong> {data.tipo_annuncio}</p>
                <p><strong>Prezzo:</strong> {formatPrice(data.prezzo)}</p>
                <p><strong>Dimensione:</strong> {data.dimensione_mq} mq</p>
                <p><strong>Piano:</strong> {data.piano}</p>
                <p><strong>Stanze:</strong> {data.stanze}</p>
                <p><strong>Classe energetica:</strong> {data.classe_energetica}</p>
                <p><strong>Ascensore:</strong> {data.ascensore ? "Sì" : "No"}</p>
                <p><strong>Portineria:</strong> {data.portineria ? "Sì" : "No"}</p>
                <p><strong>Climatizzazione:</strong> {data.climatizzazione ? "Sì" : "No"}</p>
                <p><strong>Vicino scuole:</strong> {data.vicino_scuole ? "Sì" : "No"}</p>
                <p><strong>Vicino parchi:</strong> {data.vicino_parchi ? "Sì" : "No"}</p>
                <p><strong>Vicino trasporti:</strong> {data.vicino_trasporti ? "Sì" : "No"}</p>
                {data.indirizzo && (
                <p className="col-span-2"><strong>Indirizzo:</strong> {data.indirizzo.streetAddress} {data.indirizzo.houseNumber}, {data.indirizzo.postalCode} {data.indirizzo.city} ({data.indirizzo.province}), {data.indirizzo.country}</p>
                )}
            </div>

            <div className="flex justify-center mt-6">
                <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
                >
                Conferma invio
                </button>
            </div>
            </div>
        </div>
        )}


    </div>
  );
};

export default FormImmobile;
