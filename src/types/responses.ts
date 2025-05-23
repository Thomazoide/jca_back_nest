export interface responsePayload<T> {
    message: string
    data?: T
    error: boolean
}

export interface loginSuccess {
    token: string
}