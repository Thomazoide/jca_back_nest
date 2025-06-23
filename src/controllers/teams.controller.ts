import { Body, Controller, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/config/auth/jwtAuthGuard.config";
import { Teams } from "src/models/teams.model";
import { TeamService } from "src/services/teams.service";
import { responsePayload } from "src/types/responses";

@Controller("equipos")
export class TeamsController {
    constructor(
        private readonly service: TeamService
    ){}

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
}