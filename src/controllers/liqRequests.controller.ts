import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/config/auth/jwtAuthGuard.config";
import { LiqRequest } from "src/models/liqRequests";
import { LiqRequestService } from "src/services/liqRequests.service";
import { ResponsePayloadDTO } from "src/types/dtos/response.dtos";
import { responsePayload } from "src/types/responses";

@Controller("liquidaciones-solicitud")
export class LiqRequestController {
    constructor(
        private readonly service: LiqRequestService
    ){}

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Crea o actualiza una peticion de liquidaciones"
    })
    @ApiBearerAuth()
    @ApiBody({
        type: LiqRequest
    })
    @ApiResponse({
        status: 200 | 201,
        description: "Exito",
        type: ResponsePayloadDTO<LiqRequest>
    })
    @Put()
    async CreateOrUpdate(
        @Body()
        data: Partial<LiqRequest>
    ): Promise<responsePayload<LiqRequest>> {
        try{
            const response: responsePayload<LiqRequest> = {
                message: "Exito",
                data: await this.service.createOrUpdate(data),
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
        summary: "Entrega todas las solicitudes de liquidaciones"
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Exito",
        type: ResponsePayloadDTO<LiqRequest[]>
    })
    @Get()
    async GetRequests(): Promise<responsePayload<LiqRequest[]>> {
        try{
            const response = await this.service.getRequests()
            return {
                message: "Solicitudes",
                data: response,
                error: false
            }
        }catch(err){
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }
}