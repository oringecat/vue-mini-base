export class TaskQueue<Args extends unknown[] = []> {
    private currentQueues = new Map<symbol, (...args: Args) => void | Promise<void>>() // 正在处理的队列
    private pendingQueues = new Map<symbol, (...args: Args) => void | Promise<void>>() // 排队等待的队列
    private isRunning = false

    add(fn: (...args: Args) => void | Promise<void>) {
        const key = Symbol()
        const targetQueues = this.isRunning ? this.pendingQueues : this.currentQueues
        targetQueues.set(key, fn)

        return () => {
            this.currentQueues.delete(key)
            this.pendingQueues.delete(key)
        }
    }

    async run(...args: Args) {
        if (this.isRunning) return []
        if (!this.size) return []

        this.isRunning = true

        try {
            // 合并队列
            const allQueues = new Map([...this.currentQueues, ...this.pendingQueues])
            this.currentQueues.clear()
            this.pendingQueues.clear()

            const tasks = Array.from(allQueues.values())

            const results = await Promise.all(
                tasks.map((task) => Promise.resolve(task(...args)).catch((e) => Promise.reject(e)))
            )
            return results
        } finally {
            this.isRunning = false
            // 检查是否有新队列
            if (this.pendingQueues.size > 0) {
                await this.run(...args)
            }
        }
    }

    get size() {
        return this.currentQueues.size + this.pendingQueues.size
    }
}