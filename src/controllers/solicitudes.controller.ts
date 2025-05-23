import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/config/auth/jwtAuthGuard.config";
import { Solicitud } from "src/models/solicitud.model";
import { AccountRequestService } from "src/services/solicitudes.service";
import { SolicitudDTO } from "src/types/dtos/request.dtos";
import { ResponsePayloadDTO } from "src/types/dtos/response.dtos";
import { responsePayload } from "src/types/responses";

@ApiTags("solicitudes")
@Controller("solicitudes")
export class AccountRequestController {
    constructor(
        private readonly service: AccountRequestService
    ){}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Entrega todas las solicitudes existentes"
    })
    @ApiResponse({
        status: 200,
        description: "Solicitudes",
        type: ResponsePayloadDTO<Solicitud[]>
    })
    @Get()
    async findAll(): Promise<responsePayload<Solicitud[]>> {
        try{
            const response: responsePayload<Solicitud[]> = {
                message: "Solicitudes de cuenta",
                data: await this.service.findAll(),
                error: false
            }
            return response
        }catch(err){
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }

    @ApiOperation({
        summary: "Crea una solicitud de usuario"
    })
    @ApiBody({
        type: SolicitudDTO
    })
    @ApiResponse({
        status: 201,
        description: "Solicitud creada",
        type: ResponsePayloadDTO<Solicitud>
    })
    @Post()
    async createRequest(
        @Body()
        req: Partial<Solicitud>
    ): Promise<responsePayload<Solicitud>> {
        try{
            const response: responsePayload<Solicitud> = {
                message: "Solicitud creada",
                data: await this.service.createRequest(req),
                error: false
            }
            return response
        }catch(err){
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Actualiza el estado de una solicitud"
    })
    @ApiBearerAuth()
    @ApiBody({
        type: SolicitudDTO
    })
    @ApiResponse({
        status: 200,
        description: "Solicitud actualizada",
        type: ResponsePayloadDTO<Solicitud>
    })
    @Put(":id")
    async updateRequest(
        @Param("id", ParseIntPipe)
        id: number,
        @Body()
        req: Partial<Solicitud>
    ): Promise<responsePayload<Solicitud>> {
        try{
            const response: responsePayload<Solicitud> = {
                message: "Solicitud actualizada",
                data: await this.service.updateRequest(id, req),
                error: false
            }
            return response
        }catch(err){
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }
}