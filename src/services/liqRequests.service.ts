import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LiqRequest } from "src/models/liqRequests";
import { Repository } from "typeorm";

@Injectable()
export class LiqRequestService {
    constructor(
        @InjectRepository(LiqRequest)
        private readonly repository: Repository<LiqRequest>
    ){}

    async createOrUpdate(data: Partial<LiqRequest>): Promise<LiqRequest> {
        return this.repository.save(data)
    }

    async getRequests(): Promise<LiqRequest[]> {
        return this.repository.find()
    }
}