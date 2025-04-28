
export type ContainerInfos = {
    city: string
    coordinates: {
        latitude: number
        longitude: number
    }
}

export type ContainerInfosWithExpiredDate = ContainerInfos & {
    expiresAt: number
}

class ContainerInfosCache {
    private static instance: ContainerInfosCache;
    private containerInfosMap = new Map<string, ContainerInfosWithExpiredDate>()

    public static getInstance(): ContainerInfosCache {
        if (!ContainerInfosCache.instance) ContainerInfosCache.instance = new ContainerInfosCache();

        return ContainerInfosCache.instance;
    }

    private isExpired(containerInfos: ContainerInfosWithExpiredDate){
        if (containerInfos.expiresAt < Date.now()) return true

        return false
    }

    private deleteExpiredContainerInfos(containerReference: string){
        return this.containerInfosMap.delete(containerReference)
    }

    public cacheContainerInfos(containerReference: string, containerInfos: ContainerInfos) {
        const expirationTimeMs = 30 * 60 * 1000 // Ten minutes
        const expiresAt = Date.now() + expirationTimeMs

        return this.containerInfosMap.set(containerReference, {
            ...containerInfos,
            expiresAt
        })
    }

    private cleanExpiredContainerInfos() {
        this.containerInfosMap.forEach((containerInfosCached, key) => {
            const isExpired = this.isExpired(containerInfosCached)

            if(isExpired) this.deleteExpiredContainerInfos(key)
        })
    }

    public getContainerInfosCached(containerReference: string) {
        this.cleanExpiredContainerInfos()
        const containerInfosCached = this.containerInfosMap.get(containerReference)

        if (containerInfosCached) return containerInfosCached
        
        return null
    }
}

export const containerInfosCache = ContainerInfosCache.getInstance()
