import React, { useState, useRef, useEffect } from "react";
import {
  LoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 41.902782,
  lng: 12.496366,
};

const libraries: ("places")[] = ["places"];

export interface Indirizzo {
  streetAddress: string;
  houseNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

interface AddressFormProps {
  onAddressChange: (address: Indirizzo | null) => void; // accetta anche null per resettare
}

const AddressForm: React.FC<AddressFormProps> = ({ onAddressChange }) => {
  const [streetAddress, setStreetAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState<number>(defaultCenter.lat);
  const [lng, setLng] = useState<number>(defaultCenter.lng);
  const [isHouseNumberValid, setIsHouseNumberValid] = useState(true);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const notifyParent = () => {
    // Controlla che tutti i campi richiesti siano valorizzati e validi
    if (
      streetAddress &&
      houseNumber &&
      city &&
      province &&
      postalCode &&
      country &&
      isHouseNumberValid
    ) {
      onAddressChange({
        streetAddress,
        houseNumber,
        city,
        province,
        postalCode,
        country,
        lat,
        lng,
      });
    } else {
      // Se manca qualcosa, resetta il form genitore
      onAddressChange(null);
    }
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();

    if (!place?.geometry || !place.geometry.location) {
      alert("L'indirizzo inserito non è valido o non esiste.");
      onAddressChange(null);
      return;
    }

    const location = place.geometry.location;
    setLat(location.lat());
    setLng(location.lng());

    // Reset campi per riempirli con dati nuovi
    setCity("");
    setProvince("");
    setPostalCode("");
    setCountry("");
    setHouseNumber("");

    place.address_components?.forEach((component) => {
      const types = component.types;
      if (types.includes("route")) {
        setStreetAddress(component.long_name);
      } else if (types.includes("street_number")) {
        setHouseNumber(component.long_name);
      } else if (types.includes("locality")) {
        setCity(component.long_name);
      } else if (types.includes("administrative_area_level_2")) {
        setProvince(component.short_name);
      } else if (types.includes("postal_code")) {
        setPostalCode(component.long_name);
      } else if (types.includes("country")) {
        setCountry(component.long_name);
      }
    });
  };

  const clearAllFields = () => {
    setStreetAddress("");
    setHouseNumber("");
    setCity("");
    setProvince("");
    setPostalCode("");
    setCountry("");
    setLat(defaultCenter.lat);
    setLng(defaultCenter.lng);
    onAddressChange(null); // reset genitore
  };

  const handleStreetAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreetAddress(e.target.value);
    setCity("");
    setProvince("");
    setPostalCode("");
    setCountry("");
    setHouseNumber("");
    onAddressChange(null); // reset genitore perché indirizzo modificato manualmente
  };

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setHouseNumber(value);
      setIsHouseNumberValid(true);
      onAddressChange(null); // reset genitore in attesa conferma completo
    } else {
      setIsHouseNumberValid(false);
      onAddressChange(null);
    }
  };

  // Usa useEffect per notificare il genitore quando i dati sono completi e corretti
  useEffect(() => {
    notifyParent();
  }, [streetAddress, houseNumber, city, province, postalCode, country, lat, lng, isHouseNumberValid]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries}
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            options={{ types: ["address"], componentRestrictions: { country: "it" } }}
          >
            <input
              type="text"
              value={streetAddress}
              onChange={handleStreetAddressChange}
              style={{ position: "relative", zIndex: 10 }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && streetAddress === "") {
                  clearAllFields();
                }
              }}
              placeholder="Inserisci l'indirizzo"
              className="w-[300px] p-2 rounded border border-gray-300 bg-gray-200 focus:bg-white transition-colors duration-300"
            />
          </Autocomplete>

          <input
            type="text"
            value={houseNumber}
            onChange={handleHouseNumberChange}
            style={{ position: "relative", zIndex: 10 }}
            placeholder="Numero Civico"
            className={`w-full md:w-40 p-2 rounded border ${
              isHouseNumberValid ? "border-gray-300" : "border-red-500"
            } bg-gray-200 focus:bg-white transition-colors duration-300`}
          />

          <button
            type="button"
            onClick={clearAllFields}
            style={{ position: "relative", zIndex: 10 }}
            className="ml-auto mt-2 md:mt-0 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Pulisci Indirizzo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={city}
            placeholder="Città"
            disabled
            className="w-full p-2 rounded border border-black bg-gray-300 cursor-not-allowed text-gray-700"
          />
          <input
            type="text"
            value={province}
            placeholder="Provincia"
            disabled
            className="w-full p-2 rounded border border-black bg-gray-300 cursor-not-allowed text-gray-700"
          />
          <input
            type="text"
            value={postalCode}
            placeholder="Codice Postale"
            disabled
            className="w-full p-2 rounded border border-black bg-gray-300 cursor-not-allowed text-gray-700"
          />
          <input
            type="text"
            value={country}
            placeholder="Paese"
            disabled
            className="w-full p-2 rounded border border-black bg-gray-300 cursor-not-allowed text-gray-700"
          />
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-2">Posizione sulla mappa</h3>
          <div className="rounded-lg overflow-hidden shadow-md">
            <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat, lng }} zoom={16}>
              <Marker position={{ lat, lng }} />
            </GoogleMap>
          </div>
        </div>
      </form>
    </LoadScript>
  );
};

export default AddressForm;
