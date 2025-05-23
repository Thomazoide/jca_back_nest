import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { compare, hash } from "bcrypt";

@Injectable()
export class Encrypter {
    private readonly saltRounds: number
    private readonly pepper: string

    constructor(
        private readonly env: ConfigService
    ){
        this.saltRounds = Number(this.env.get("SALT"))
        this.pepper = this.env.get<string>("PEPPER")
    }

    async hashPassword(password: string): Promise<string> {
        const securePassword = password + this.pepper
        return hash(securePassword, this.saltRounds)
    }
    
    async comparePassword(password: string, hash: string): Promise<boolean> {
        const securePassword = password + this.pepper
        return compare(securePassword, hash)
    }
}