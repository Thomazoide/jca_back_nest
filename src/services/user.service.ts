import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Encrypter } from "src/middleware/encrypter.middleware";
import { Liquidacion } from "src/models/liquidaciones.model";
import { User } from "src/models/users.model";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Liquidacion)
        private readonly liqRepository: Repository<Liquidacion>,
        private readonly encrypter: Encrypter,
        private readonly tokenService: JwtService
    ){}

    async createUser(data: Partial<User>): Promise<User> {
        const user = this.userRepository.create(data)
        user.password = await this.encrypter.hashPassword(user.password)
        return this.userRepository.save(user)
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({relations: ["liquidaciones"]})
    }

    async findById(id: number): Promise<User> {
        return this.userRepository.findOne({
            where: {id},
            relations: ["liquidaciones"]
        })
    }

    async updateUser(userID: number, data: Partial<User>): Promise<User> {
        const user = await this.userRepository.findOneBy({id: userID})
        if(!user) throw new Error("usuario no encontrado");
        if(data.password) throw new Error("Esta api es solo para valores que no necesitan encriptacion")
        Object.assign(user, data)
        return this.userRepository.save(user)
    }

    async addOrReplaceContract(userId: number, contractPath: string): Promise<User> {
        const user = await this.userRepository.findOneBy({id: userId})
        if (!user) throw new Error("usuario no encontrado");
        user.contrato = contractPath
        return this.userRepository.save(user)
    }

    async addLiquidation(id: number, path: string): Promise<Liquidacion> {
        const user = await this.userRepository.findOne({
            where: {id}
        })
        if(!user) throw new Error("usuario no encontrado");
        const liq = await this.liqRepository.findOneBy({path})
        if(!liq){
            const liquidacion = this.liqRepository.create({ path, user })
            return this.liqRepository.save(liquidacion)
        }
        liq.path = path
        return this.liqRepository.save(liq)
    }

    async login(rut: string, password: string): Promise<string> {
        const user = await this.userRepository.findOneBy({rut})
        if (!user) throw new Error("usuario no encontrado");
        const passwordMatch = await this.encrypter.comparePassword(password, user.password)
        if (!passwordMatch) throw new Error("Contraseña incorrecta");
        const payload = user.toSignData()
        return this.tokenService.sign(payload)
    }

    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.userRepository.findOneBy({id})
        if (!user) throw new Error("Usuario no encontrado");
        const passwordMatch = await this.encrypter.comparePassword(oldPassword, user.password)
        if(!passwordMatch) throw new Error("Contraseñas no coinciden");
        user.password = await this.encrypter.hashPassword(newPassword)
        this.userRepository.save(user)
        return passwordMatch
    }
}