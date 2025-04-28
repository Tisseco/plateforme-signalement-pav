import type { ContainerInfos } from "../cache/containerInfos"

type Result<T> = { success: true; data: T } | { success: false; error: Error }

export const fetchContainerInfos = (AstroUrlOrigin: string) => async (containerRef: string): Promise<Result<ContainerInfos>> => {
    try {
        const response = await fetch(`${AstroUrlOrigin}/api/pav-geoposition?containerRef=${containerRef}`)
        
        if(!response.ok) throw new Error(response.statusText)
    
        const data : ContainerInfos = await response.json()
    
        return { success: true, data }
    } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred')
        
        return { success: false, error }
    }
}
