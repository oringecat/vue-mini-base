/**
 * 本地存储类
 */
export default class <T extends object> {
    constructor(storage: Storage, source: T, prefix?: string) {
        this.storage = storage
        this.prefix = (prefix || location.hostname) + ':'
        this.source = this.deepClone(source)
        this.data = this.deepClone(source)

        for (const key in source) {
            const value = this.getValue(key)
            this.data[key] = value
        }
    }

    private readonly storage
    private readonly prefix
    private readonly source: T
    private data: T

    get state(): T {
        return this.deepClone(this.data)
    }

    /**
     * 深度克隆
     * @param obj 
     * @returns 
     */
    private deepClone(obj: T) {
        return JSON.parse(JSON.stringify(obj))
    }

    /**
     * 更新数据
     * @param key 
     * @param value 
     */
    setValue<K extends keyof T>(key: K, value: T[K]) {
        if (value != null) {
            const json = JSON.stringify(value)
            this.storage.setItem(this.prefix + key.toString(), json)
        }
    }

    /**
     * 获取数据
     * @param key 
     * @returns 
     */
    getValue<K extends keyof T>(key: K): T[K] {
        const value = this.storage.getItem(this.prefix + key.toString())
        return value != null ? JSON.parse(value) : this.source[key]
    }

    /**
     * 重置数据
     * @param keys 
     */
    reset<K extends keyof T>(...keys: K[]) {
        const storageKeys = keys.length ? keys : (Object.keys(this.source) as K[])

        storageKeys.forEach((key) => {
            const storageKey = this.prefix + key.toString()
            this.storage.removeItem(storageKey)
            this.data[key] = this.source[key]
        })

        if (!keys.length) {
            this.data = this.deepClone(this.source)
        }
    }
}