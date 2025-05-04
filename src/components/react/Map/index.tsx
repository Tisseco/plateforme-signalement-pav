import { useEffect } from "react";
import type { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

function ChangeMapView({ position }: { position: LatLngTuple }) {
    const map = useMap();
    
    useEffect(() => {
        map.dragging.disable()
        map.touchZoom.disable()
        map.scrollWheelZoom.disable()
        map.flyTo(position, map.getZoom());
        map.once('moveend', () => {
            map.dragging.enable()
            map.touchZoom.enable()
            map.scrollWheelZoom.enable()
        });
    }, [map, position]);
    return <></>
}

interface MarkerProps {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

export function ContainerMarker({ name, address, latitude, longitude }: MarkerProps) {
    return (
        <Marker position={[latitude, longitude]} alt="to tot tot">
            <Popup aria-label="sfdg">
                {name} <br /> {address}
            </Popup>
        </Marker>
    );
}

interface MapProps<T> {
    position: LatLngTuple,
    markers: T[] | null;
    renderMarker: (marker: T) => React.ReactNode;
}

function Map<T>({ position, markers, renderMarker }: MapProps<T>) {

    return (
        <MapContainer center={position} zoom={25}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { markers ?
                markers.map((marker) => renderMarker(marker))
            :
                <Marker position={position} alt="to tot tot">
                    <Popup aria-label="sfdg">
                    A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            }
            <ChangeMapView position={position} />
        </MapContainer>
    )
}

export const Toto = Map<MarkerProps>