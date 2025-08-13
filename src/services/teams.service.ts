import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Teams } from "src/models/teams.model";
import { User } from "src/models/users.model";
import { IsNull, Repository } from "typeorm";
import { CARGOS } from "src/enums/cargos.enum";

@Injectable()
export class TeamService {

    constructor(
        @InjectRepository(Teams)
        private readonly repository: Repository<Teams>,
        @InjectRepository(User)
        private readonly uRepository: Repository<User>
    ){}

    async CreateTeam(data: Partial<Teams>): Promise<Teams> {
        const newTeam = this.repository.create(data)
        return this.repository.save(newTeam)
    }

    async AddGuard(userID: number, teamID: number): Promise<Teams> {
        const team = await this.repository.findOne({
            where: {
                id: teamID
            },
            relations: ["guardias"]
        })
        const user = await this.uRepository.findOneBy({id: userID})
        if(!team) throw new Error("Equipo no encontrado");
        if(!user) throw new Error("Usuario no encontrado");
        if(user.equipoGuardia) throw new Error("Usuario ya pertenece a un equipo");
        user.equipoGuardia = team
        await this.uRepository.save(user)
        return this.repository.findOne({
            where: {
                id: teamID
            },
            relations: ["guardias"]
        })
    }

    async RemoveGuard(userID: number): Promise<User> {
        const user = await this.uRepository.findOne({
            where: {
                id: userID
            },
            relations: ["equipoGuardia"]
        })
        if(!user) throw new Error("Usuario no encontrado");
        if(!user.equipoGuardia) throw new Error("El usuario no pertenece a ningun equipo");
        user.equipoGuardia = null
        return this.uRepository.save(user)
    }

    async GetAllTeams(): Promise<Array<Teams>> {
        return await this.repository.find();
    }

    async GetTeamBySupervisorID(supervisorID: number): Promise<Teams> {
        return await this.repository.findOne({
            where: {
                supervisorID
            },
            relations: ["guardias"]
        })
    }

    async GetUnassignedGuards(): Promise<User[]> {
        return this.uRepository.find({
            where: {
                cargo: CARGOS.GUARDIA,
                equipoGuardia: IsNull()
            }
        })
    }
}