import WebStorage from '@/utils/storage'
import type { LocalStorageKeys, SessionStorageKeys } from './types'

export const localData = new WebStorage<LocalStorageKeys>(localStorage, {
    language: navigator.language,
    token: '',
    autoLoginEncrypted: '',
    rememberMe: false
})

export const sessionData = new WebStorage<SessionStorageKeys>(sessionStorage, {
    token: '',
    statusEnums: [],
    errorCodes: []
})