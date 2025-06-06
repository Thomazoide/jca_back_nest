export interface loginPayload {
    rut: string
    password: string
}

export interface changePasswordPayload {
    oldPassword: string
    newPassword: string
}

export interface checkTokenPayload {
    token: string
}