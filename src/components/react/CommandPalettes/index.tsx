import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import useDebouncedFunction from './hooks/useDebounceFunction';

// Types géométriques de base (GeoJSON standard)
type PointGeometry = {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude] en WGS-84 (EPSG 4326)
};
  
// Propriétés d'une adresse
type AddressProperties = {
    label: string;
    score: number; // entre 0 et 1
    id: string; // identifiant unique
    banId: string;
    type: "housenumber" | "street" | "locality" | "municipality";
    name: string;
    postcode: string;
    citycode: string; // code INSEE
    x: number; // coordonnée en projection légale
    y: number; // coordonnée en projection légale
    city: string;
    context: string; // "département, région"
    importance: number;
    _type: "address";
    // Champs optionnels selon le type d'adresse
    population?: number;
    housenumber?: string;
    street?: string;
    locality?: string;
    municipality?: string;
    district?: string; // pour Paris/Lyon/Marseille
    oldcitycode?: string; // code INSEE ancienne commune
    oldcity?: string; // nom ancienne commune
};
  
// Feature GeoJSON avec nos propriétés spécifiques
export type AddressFeature = {
    type: "Feature";
    geometry: PointGeometry;
    properties: AddressProperties;
};
  
// Métadonnées de la réponse
type ApiMetadata = {
    attribution: string;
    licence: string;
    query: string; // requête originale
    limit: number; // nombre maximum de résultats
};
  
// Réponse complète de l'API
type GeoJSONFeatureCollection = {
    type: "FeatureCollection";
    version: string; // version de l'API
    features: AddressFeature[];
} & ApiMetadata;

const getAdresses = (query: string, signal: AbortSignal) : Promise<GeoJSONFeatureCollection> => fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`, { signal })
.then(res => res.json())

export default function CommandPalettes({ setAddress }: { setAddress: Dispatch<SetStateAction<AddressFeature | null>>}) {
  const [addresses, setAddresses] = useState<AddressFeature[] | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null);
  const debouncedGetAddresses = useDebouncedFunction<(query: string, signal: AbortSignal) => void>((query, signal) => getAdresses(query, signal).then(response => setAddresses(response.features)), 300);

    useEffect(() => {
        return () => {
            // Cleanup function to abort any pending requests
            if (abortControllerRef.current) {
              abortControllerRef.current.abort("User typed a new input value while previous request is not finished");
              abortControllerRef.current = null
            }
          };
    }, [])

    return (
        <div className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in">
            <Combobox
                onChange={async (label) => {
                    const address = addresses?.find(address => address.properties.label === label)
                    if (address) setAddress(address)
                    setAddresses(null)
                }}
            >
                <div className="grid grid-cols-1">
                    <ComboboxInput
                        autoComplete="off"
                        autoFocus
                        className="col-start-1 row-start-1 h-12 w-full pr-4 pl-11 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm"
                        placeholder="Taper une adresse..."
                        onChange={(event) => {
                            // Abort any pending requests
                            if (abortControllerRef.current) {
                                abortControllerRef.current.abort("User typed a new input value while previous request is not finished");
                            }
                        
                            // Create new abort controller
                            const newAbortController = new AbortController();
                        
                            abortControllerRef.current = newAbortController;
                            // Call onSearch with new search term and abort controller

                            if (event.target.value.length > 2) {
                                debouncedGetAddresses(event.target.value, newAbortController.signal)
                            }
                        }}
                    />
                    <MagnifyingGlassIcon
                        className="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400"
                        aria-hidden="true"
                    />
                </div>

                {addresses && addresses.length > 0 && (
                    <ComboboxOptions static className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800">
                        {addresses.map((address) => (
                        <ComboboxOption
                            key={address.properties.id}
                            value={address.properties.label}
                            className="cursor-default px-4 py-2 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                        >
                            {address.properties.label}
                        </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}

                {addresses && addresses.length === 0 && (
                    <p className="p-4 text-sm text-gray-500">Aucune adresse trouvée.</p>
                )}
            </Combobox>
        </div>
    )
}
