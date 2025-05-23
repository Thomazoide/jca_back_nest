import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { User } from "src/models/users.model";
import { UserService } from "src/services/user.service";
import { responsePayload } from "src/types/responses";
import { Express } from "express";
import { diskStorage } from "multer";
import { Liquidacion } from "src/models/liquidaciones.model";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

@Controller('users')
export class UserController {
    constructor(
        private readonly service: UserService
    ) {}

    @Post()
    async create(
        @Body()
        data: Partial<User>
    ): Promise<responsePayload<User>> {
        try{
            const response: responsePayload<User> = {
                message: "Usuario creado",
                data: await this.service.createUser(data),
                error: false
            }
            return response
        }catch(err) {
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }

    @Get()
    async findAll(): Promise<responsePayload<User[]>> {
        try{
            const response: responsePayload<User[]> = {
                message: "Usuarios encontrados",
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

    @Get(":id")
    async findByID(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<User>> {
        try{
            const response: responsePayload<User> = {
                message: "Usuario encontrado",
                data: await this.service.findById(id),
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
    async updateUser(
        @Param("id", ParseIntPipe)
        id: number,
        @Body()
        data: Partial<User>
    ): Promise<responsePayload<User>> {
        try{
            const response: responsePayload<User> = {
                message: "Usuario actualizado",
                data: await this.service.updateUser(id, data),
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

    @Put(":id/contrato")
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./uploads/contratos",
            filename: (_, file, cb) => cb(null, file.filename)
        })
    }))
    async addOrReplaceContract(
        @Param("id", ParseIntPipe)
        id: number,
        @UploadedFile()
        file: Express.Multer.File
    ): Promise<responsePayload<User>> {
        try{
            const path = `/uploads/contratos/${file.filename}`
            await this.service.addOrReplaceContract(id, path)
            return {
                message: "Contrato actualizado",
                error: false

            }
        }catch(err){
            return {
                message: (err as Error).message,
                error: true
            }
        }
    }

    @Put(":id/liquidaciones")
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./uploads/liquidaciones",
            filename: (_, file, cb) => cb(null, file.filename)
        })
    }))
    async addLiquidation(
        @Param("id", ParseIntPipe)
        id: number,
        @UploadedFile()
        file: Express.Multer.File
    ): Promise<responsePayload<Liquidacion>> {
        try{
            const path = `/uploads/liquidaciones/${file.filename}`
            const response: responsePayload<Liquidacion> = {
                message: "Liquidacion agregada",
                data: await this.service.addLiquidation(id, path),
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

    @Get(":id/contrato/base64")
    async getContratoBase64(
        @Param("id")
        id: number
    ): Promise<responsePayload<{
        base64: string
    }>> {
        try{
            const user = await this.service.findById(id)
            if(!user || !user.contrato) {
                return {
                    message: "Contrato no encontrado",
                    error: true
                }
            }
            const filePath = join(process.cwd(), user.contrato.replace(/^\//, ''))
            if(!existsSync(filePath)) {
                return {
                    message: "Contrato no encontrado",
                    error: true
                }
            }
            const fileBuffer = readFileSync(filePath)
            const base64 = fileBuffer.toString('base64')
            return {
                message: "Contrato en base64",
                data: { base64 },
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