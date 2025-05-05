import { useState, useEffect } from 'react';

interface PrezzoDropdownProps {
  prezzoMin: number;
  prezzoMax: number;
  setPrezzoMin: (value: number) => void;
  setPrezzoMax: (value: number) => void;
  onConfirm: () => void;
}

export default function PrezzoDropdown({
  prezzoMin,
  prezzoMax,
  setPrezzoMin,
  setPrezzoMax,
  onConfirm,
}: PrezzoDropdownProps) {
  const generatePriceOptions = () => {
    const options: number[] = [];

    for (let i = 0; i <= 100000; i += 5000) {
      options.push(i);
    }
    for (let i = 110000; i <= 500000; i += 10000) {
      options.push(i);
    }
    for (let i = 600000; i <= 2000000; i += 100000) {
      options.push(i);
    }

    return options;
  };

  const [priceOptions, setPriceOptions] = useState<number[]>([]);

  useEffect(() => {
    setPriceOptions(generatePriceOptions());
  }, []);

  const formatPrice = (price: number) => {
    if (!price) return '';
    return price.toLocaleString(); // Formatta il numero con il punto per le migliaia
  };

  const handleManualInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'min' | 'max'
  ) => {
    const value = Number(e.target.value.replace(/\D/g, '')); // remove non-numeric chars

    if (type === 'min') {
      setPrezzoMin(value || 0); // reset to empty string if empty
    } else {
      setPrezzoMax(value || 2000000); // reset to empty string if empty
    }
  };

  const clearInput = (type: 'min' | 'max') => {
    if (type === 'min') {
      setPrezzoMin(0);
    } else {
      setPrezzoMax(2000000);
    }
  };

  return (
    <div>
      <div>
        <label className="block text-sm font-semibold mb-1 ml-1 mt-1">Prezzo minimo</label>
        <div className="flex items-center">
          <input
            type="text"
            value={formatPrice(prezzoMin)}
            onChange={(e) => handleManualInput(e, 'min')}
            placeholder="Inserisci prezzo min"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          {prezzoMin && (
            <button
              onClick={() => clearInput('min')}
              className="text-red-500 text-xl ml-2"
              aria-label="Clear prezzo min"
            >
              ✖
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 max-h-28 overflow-y-auto">
          {priceOptions.map((price) => (
            <button
              key={`min-${price}`}
              onClick={() => setPrezzoMin(price)}
              className="bg-gray-100 hover:bg-blue-200 text-sm p-2 rounded"
            >
              {price.toLocaleString()} €
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 ml-1 mt-2">Prezzo massimo</label>
        <div className="flex items-center">
          <input
            type="text"
            value={formatPrice(prezzoMax)}
            onChange={(e) => handleManualInput(e, 'max')}
            placeholder="Inserisci prezzo max"
            className="w-full px-3 py-2 border rounded mb-2"
          />
          {prezzoMax && (
            <button
              onClick={() => clearInput('max')}
              className="text-red-500 text-xl ml-2"
              aria-label="Clear prezzo max"
            >
              ✖
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 max-h-28 overflow-y-auto">
          {priceOptions.map((price) => (
            <button
              key={`max-${price}`}
              onClick={() => setPrezzoMax(price)}
              className="bg-gray-100 hover:bg-blue-200 text-sm p-2 rounded"
            >
              {price.toLocaleString()} €
            </button>
          ))}
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={onConfirm}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Conferma
        </button>
      </div>
    </div>
  );
}
