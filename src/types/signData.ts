import { CARGOS } from "src/enums/cargos.enum"

export interface userSignData {
    id: number
    fullName: string
    email: string
    rut: string
    cargo: CARGOS
    isAdmin: boolean
}