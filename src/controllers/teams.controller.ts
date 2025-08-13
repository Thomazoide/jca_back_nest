import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/config/auth/jwtAuthGuard.config";
import { Teams } from "src/models/teams.model";
import { TeamService } from "src/services/teams.service";
import { ResponsePayloadDTO } from "src/types/dtos/response.dtos";
import { responsePayload } from "src/types/responses";
import { User } from "src/models/users.model";

@Controller("equipos")
export class TeamsController {
    constructor(
        private readonly service: TeamService
    ){}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Obtiene todos los equipos"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<Array<Teams>>
    })
    @Get()
    async GetTeams(): Promise<responsePayload<Array<Teams>>> {
        try{
            return {
                message: "Equipos encontrados",
                data: await this.service.GetAllTeams(),
                error: false
            }
        }catch(err){
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Obtiene un equipo segun el ID de un supervisor"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<Teams>
    })
    @Get(":sid")
    async GetTeamBySupervisorID(
        @Param("sid", ParseIntPipe)
        supervisorID: number
    ): Promise<responsePayload<Teams>> {
        try{
            return {
                message: "Equipo encontrado",
                data: await this.service.GetTeamBySupervisorID(supervisorID),
                error: false
            }
        }catch(err){
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: ""
    })
    @Post()
    async CreateTeam(
        @Body()
        data: Partial<Teams>
    ): Promise<responsePayload<Teams>> {
        try{
            const response: responsePayload<Teams> = {
                message: "Equipo creado",
                data: await this.service.CreateTeam(data),
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

    //gid = ID del guardia a agregar; tid = ID del equipo;
    @Put("agregar-guardia/:gid/:tid")
    async AddGuard(
        @Param("gid", ParseIntPipe)
        guardID: number,
        @Param("tid", ParseIntPipe)
        teamID: number
    ): Promise<responsePayload<Teams>> {
        try{
            const response: responsePayload<Teams> = {
                message: "Guardia agregado",
                data: await this.service.AddGuard(guardID, teamID),
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
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Obtiene todos los guardias sin equipo"
    })
    @ApiResponse({
        status: 200,
        type: ResponsePayloadDTO<Array<User>>
    })
    @Get("guardias/sin-equipo")
    async GetUnassignedGuards(): Promise<responsePayload<Array<User>>> {
        try{
            return {
                message: "Guardias sin equipo",
                data: await this.service.GetUnassignedGuards(),
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