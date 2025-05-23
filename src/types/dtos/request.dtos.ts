import { ApiProperty } from "@nestjs/swagger";
import { CARGOS } from "src/enums/cargos.enum";

export class UserDTO {
    @ApiProperty()
    id: number
    @ApiProperty()
    fullName: string
    @ApiProperty()
    email: string
    @ApiProperty()
    rut: string
    @ApiProperty()
    cargo: CARGOS
    @ApiProperty()
    password: string
    @ApiProperty()
    isAdmin: boolean
}

export class LoginPayloadDTO {
    @ApiProperty()
    rut: string
    @ApiProperty()
    password: string
}

export class SolicitudDTO {
    @ApiProperty()
    email: string
    @ApiProperty()
    rut: string
}