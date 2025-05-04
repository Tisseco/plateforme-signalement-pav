import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css"
import type { LatLngTuple } from "leaflet";

import CommandPalettes from "../CommandPalettes";
import type { AddressFeature } from "../CommandPalettes";
import { ContainerMarker, Toto } from "../Map";
import { fetchNearestContainer } from "../../../services/fetchNearestContainers";

interface MarkerProps {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export default function InteractiveMap({ astroUrlOrigin }: { astroUrlOrigin: string }) {
    const [address, setAddress] = useState<AddressFeature | null>(null)
    const [containers, setContainers] = useState<MarkerProps[] | null>(null)
    const position: LatLngTuple = address ? [address.geometry.coordinates[1], address.geometry.coordinates[0]] : [51.505, -0.09]

    useEffect(() => {
        if (address) {
            fetchNearestContainer(astroUrlOrigin)(position).then(res => res.success && setContainers(res.data))
        }
    }, [address])

    return (
        <div className="h-full space-y-4">
            <div className="relative p-2 bg-indigo-600 h-16 z-10">
                <CommandPalettes setAddress={setAddress} />
            </div>
            <div className="h-[calc(100%-8rem)] m-2 rounded-2xl overflow-hidden">
                <Toto position={containers ? [containers[0].latitude, containers[0].longitude] : position} markers={containers} renderMarker={(marker) => <ContainerMarker key={marker.name} {...marker}/>}/>
            </div>
        </div>
    )
}
