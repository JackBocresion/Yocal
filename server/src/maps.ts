export function jsonify<K,V>(this:Map<K, V>):Array<[K,V]> {
    return Array.from(this as any)
}

export function mapify<T>(this:Array<T>, key: string):Map<string,T> {
    let outMap = new Map<string, T>()
    this.forEach((e) => {
       outMap.set((e as any)[key], e) 
    })
    return outMap
}
export function valify<K, V>(this:Map<K, V>): Array<V> {
    return Array.from(this.values())
}
