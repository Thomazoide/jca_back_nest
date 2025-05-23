import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { Solicitud } from "src/models/solicitud.model";
import { AccountRequestService } from "src/services/solicitudes.service";
import { responsePayload } from "src/types/responses";

@Controller("solicitudes")
export class AccountRequestController {
    constructor(
        private readonly service: AccountRequestService
    ){}

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