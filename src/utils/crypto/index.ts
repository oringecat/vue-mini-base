import cryptojs from 'crypto-js'
import JSEncrypt from 'jsencrypt'

/**
 * 利用 canvas 创建浏览器唯一标识
 * 由于不同客户端绘制 canvas 时渲染参数、抗锯齿等算法不同，因此绘制成图片数据的 CRC 校验也不一样
 * @param text 
 * @returns 
 */
export function getClientUUID(text = 'canvas') {
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100

    const ctx = canvas.getContext('2d')
    if (ctx) {
        ctx.font = '14px Arial'
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, canvas.width / 2, canvas.height / 2) // 文本水平垂直居中
    }

    const base64Url = canvas.toDataURL()
    return cryptojs.MD5(base64Url).toString()
}

/**
 * AES加密
 * @param data 
 * @param key 
 * @returns 
 */
export function encryptAES<T extends object>(data: string, key = getClientUUID(), cfg?: T) {
    // 统一将传入的字符串转成UTF8编码
    const _data = cryptojs.enc.Utf8.parse(data) // 需要加密的数据
    const _key = cryptojs.enc.Utf8.parse(key) // 秘钥
    const encrypted = cryptojs.AES.encrypt(_data, _key, {
        mode: cryptojs.mode.ECB,
        ...cfg
    })
    return encrypted.ciphertext.toString() //  返回加密后的值
}

/**
 * AES解密
 * @param encryptedData 
 * @param key 
 * @returns 
 */
export function decryptAES<T extends object>(encryptedData: string, key = getClientUUID(), cfg?: T) {
    // 统一将传入的字符串转成UTF8编码
    const _data = cryptojs.format.Hex.parse(encryptedData)
    const _key = cryptojs.enc.Utf8.parse(key) // 秘钥
    const decrypted = cryptojs.AES.decrypt(_data, _key, {
        mode: cryptojs.mode.ECB,
        ...cfg
    })
    return decrypted.toString(cryptojs.enc.Utf8)
}

/**
 * RSA加密
 * @param data 
 * @param key 
 * @returns 
 */
export function encryptRSA(data: string, key: string) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(key)
    return encryptor.encrypt(data)
}

/**
 * 生产随机字符串
 * @param length 
 * @returns 
 */
export function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}