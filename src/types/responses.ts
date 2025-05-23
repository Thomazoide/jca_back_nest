export interface responsePayload<T> {
    message: string
    data?: T
    error: boolean
}