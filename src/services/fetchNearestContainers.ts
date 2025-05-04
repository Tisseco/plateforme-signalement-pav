import type { LatLngTuple } from "leaflet";

type Result<T> = { success: true; data: T } | { success: false; error: Error }

type ContainerInfos = {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: string;
};

export const fetchNearestContainer = (astroUrlOrigin: string) => async (latLngTuple: LatLngTuple): Promise<Result<ContainerInfos[]>> => {
    try {
        const response = await fetch(`${astroUrlOrigin}/api/nearest-pav?lat=${latLngTuple[0]}&lng=${latLngTuple[1]}`)
        
        if(!response.ok) throw new Error(response.statusText)
    
        const data : ContainerInfos[] = await response.json()
    
        return { success: true, data }
    } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred')
        
        return { success: false, error }
    }
}
