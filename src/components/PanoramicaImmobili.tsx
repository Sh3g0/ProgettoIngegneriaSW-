interface Immobile {
    id: number;
    titolo: string;
    descrizione: string;
    prezzo: number;
    indirizzo: string;
    immagini: string[];
  }
  
  interface Props {
    immobili: Immobile[];
  }
  
  const PanoramicaImmobili = ({ immobili }: Props) => {
    return (
      <div className="h-[600px] overflow-y-auto space-y-4 pr-2">
        {immobili.map((immobile) => (
          <div
            key={immobile.id}
            className="flex flex-col border rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={immobile.immagini?.[0] || 'https://via.placeholder.com/400x200'}
              alt={immobile.titolo}
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="text-md font-semibold truncate">{immobile.titolo}</h3>
              <p className="text-sm text-gray-600 truncate">{immobile.indirizzo}</p>
              <p className="text-blue-600 font-bold mt-1">€{immobile.prezzo.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default PanoramicaImmobili;
  