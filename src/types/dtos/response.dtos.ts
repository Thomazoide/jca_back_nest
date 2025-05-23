import { ApiProperty } from "@nestjs/swagger";

export class ResponsePayloadDTO<T> {
    @ApiProperty()
    message: string
    @ApiProperty()
    error: boolean
    @ApiProperty({required: false})
    data?: T
}

export class LoginSuccessDTO {
    @ApiProperty()
    token: string
}