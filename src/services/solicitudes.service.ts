import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Solicitud } from "src/models/solicitud.model";
import { Repository } from "typeorm";

@Injectable()
export class AccountRequestService {
    constructor(
        @InjectRepository(Solicitud)
        private readonly repository: Repository<Solicitud>
    ){}

    async createRequest(req: Partial<Solicitud>): Promise<Solicitud> {
        const newRequest = this.repository.create(req)
        return this.repository.save(newRequest)
    }

    async findAll(): Promise<Solicitud[]> {
        return this.repository.find()
    }

    async updateRequest(id: number, req: Partial<Solicitud>): Promise<Solicitud> {
        const accountRequest = await this.repository.findOne({where: {id}})
        if (!accountRequest) throw new Error("Solicitud no encontrada")
        Object.assign(accountRequest, req)
        return this.repository.save(accountRequest)
    }
}