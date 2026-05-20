import type { SocketOptions } from './types'

export default class {
    private socket: Promise<WebSocket> | null = null; // WebSocket 对象
    private readyState: number = WebSocket.CLOSED;
    private connectionId = 0;
    private url;
    private protocols?: string | string[];
    private isConnecting = false;
    private isReconnecting = false; // 是否正在重连
    private messageTimer = 0; // 消息超时定时器
    private messageTimeout = 1000 * 15; // 消息超时时间
    private heartbeatTimer = 0; // 心跳定时器
    private heartbeatInterval = 1000 * 30; // 心跳间隔时间
    private reconnectTimer = 0; // 重连定时器
    private reconnectCount = 0; // 本次已重连次数
    private reconnectLimit = 10; // 限制重连次数，0 = 无限制

    private heartbeatMessage?: () => string | Blob | BufferSource; // 心跳消息
    private onOpen?: () => void; // 连接成功的事件
    private onMessage: (data: MessageEvent['data']) => void; // 消息事件
    private onClose?: () => void; // 连接断开的事件
    private onError?: (err: Event) => void; // 连接发生错误的事件
    private onBeforeReconnect?: (count: number) => void; // 重连之前的事件
    private onReconnect?: () => void; // 重连成功之后的事件

    constructor(options: SocketOptions) {
        this.url = options.url
        this.protocols = options.protocols
        this.heartbeatMessage = options.heartbeatMessage
        this.onOpen = options.onOpen
        this.onMessage = options.onMessage
        this.onClose = options.onClose
        this.onError = options.onError
        this.onBeforeReconnect = options.onBeforeReconnect
        this.onReconnect = options.onReconnect
    }

    // 查询连接状态
    get isConnected() {
        return !this.isReconnecting && this.readyState === WebSocket.OPEN
    }

    // 创建 WebSocket 连接
    connect(isReconnect = false) {
        if (this.socket && (this.isConnected || this.isConnecting)) {
            return this.socket
        }

        if (!isReconnect && this.isReconnecting) {
            return Promise.reject('等待重连中')
        }

        this.stopHeartbeat()
        this.readyState = WebSocket.CLOSED

        this.socket = new Promise((resolve, reject) => {
            const ws = this.protocols ? new WebSocket(this.url, this.protocols) : new WebSocket(this.url)
            const currentConnectionId = this.connectionId + 1

            this.connectionId = currentConnectionId
            this.isConnecting = true
            console.log(this.url, '正在连接')

            // 连接成功
            ws.onopen = () => {
                if (this.connectionId === currentConnectionId) {
                    this.isConnecting = false
                    this.isReconnecting = false
                    this.readyState = WebSocket.OPEN
                    this.startHeartbeat()

                    if (this.reconnectCount) {
                        console.log(this.url, '重连成功')
                        this.reconnectCount = 0
                        this.onReconnect?.()
                    } else {
                        console.log(this.url, '连接成功')
                        this.onOpen?.()
                    }

                    resolve(ws)
                } else {
                    console.error(this.url, '重复连接')
                    ws.close()
                    reject(currentConnectionId)
                }
            }

            // 接收消息
            ws.onmessage = (event) => {
                if (this.connectionId === currentConnectionId) {
                    this.stopHeartbeat()
                    this.startHeartbeat()
                    this.onMessage?.(event.data)
                }
            }

            // 连接断开
            ws.onclose = () => {
                // 判断是否当前实例，重连时不处理旧 WebSocket 事件
                if (this.connectionId === currentConnectionId) {
                    this.stopHeartbeat()
                    this.socket = null
                    this.isConnecting = false
                    this.isReconnecting = false
                    this.readyState = WebSocket.CONNECTING
                    this.reconnect() // 进行重连尝试，直到成功为止

                    // 重连失败返回结果
                    if (this.reconnectCount === 0) {
                        console.error(this.url, '连接已断开')
                        this.readyState = WebSocket.CLOSED
                        this.onClose?.()
                    }
                }
            }

            // 连接发生错误
            ws.onerror = (error) => {
                if (this.connectionId === currentConnectionId) {
                    console.error(this.url, '连接发生错误')
                    this.onError?.(error)
                    reject(error)
                }
            }
        })

        return this.socket
    }

    // 主动断开连接，断开后不会自动重连
    disconnect(forced = false) {
        return new Promise<void>((resolve) => {
            clearTimeout(this.reconnectTimer)
            this.stopHeartbeat()
            this.connectionId++
            this.reconnectCount = 0
            this.isReconnecting = false
            this.isConnecting = false

            const cleanup = (message = '主动断开') => {
                console.warn(this.url, message)
                this.socket = null
                this.onClose?.()
                resolve()
            }

            if (this.socket) {
                this.socket.then((ws) => {
                    if (forced) {
                        ws.close()
                        cleanup('强制断开')
                    } else {
                        const listener = () => {
                            ws.removeEventListener('close', listener)
                            cleanup()
                        }
                        ws.addEventListener('close', listener)
                        ws.close()
                    }
                }).catch(() => cleanup())
            } else {
                cleanup()
            }
        })
    }

    // 发送消息
    send(data: string | Blob | BufferSource) {
        this.connect().then((ws) => {
            ws.send(data)
        })
    }

    // 断开重连
    private reconnect() {
        if (this.isReconnecting) return

        if (this.reconnectCount) {
            console.warn(this.url, `第${this.reconnectCount}次重连失败`)
        } else {
            console.warn(this.url, '连接中断')
        }

        // 重连次数小于限制次数则继续重连
        if (this.reconnectCount < this.reconnectLimit) {
            this.isReconnecting = true
            this.reconnectCount++
            this.onBeforeReconnect?.(this.reconnectCount)

            // 自动计算每次重试的延时，重试次数越多，延时越大
            const delay = this.reconnectCount * 5000
            console.log(this.url, `${delay / 1000}秒后将进行第${this.reconnectCount}次重连`)

            // Worker 中不能使用 window.setTimeout
            this.reconnectTimer = self.setTimeout(() => {
                this.connect(true)
            }, delay)
        } else {
            this.reconnectCount = 0
        }
    }

    // 发送心跳检测
    // 待优化：心跳超时后，再发送一次心跳消息，如果仍然超时，再进行重连
    private startHeartbeat() {
        const message = this.heartbeatMessage?.()
        if (message) {
            this.heartbeatTimer = self.setTimeout(() => {
                this.send(message)

                // 如果已经超过或心跳超时时长没有收到心跳回复，则认为网络已经异常，进行断网重连
                this.messageTimer = self.setTimeout(() => {
                    console.warn(this.url, '心跳超时')
                    this.reconnect()
                }, this.messageTimeout)
            }, this.heartbeatInterval)
        }
    }

    // 停止心跳检测
    private stopHeartbeat() {
        clearTimeout(this.messageTimer)
        clearTimeout(this.heartbeatTimer)
    }
}