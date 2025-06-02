import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { User } from "src/models/users.model";
import { UserService } from "src/services/user.service";
import { loginSuccess, responsePayload } from "src/types/responses";
import { Express, Response } from "express";
import { diskStorage } from "multer";
import { Liquidacion } from "src/models/liquidaciones.model";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { changePasswordPayload, loginPayload } from "src/types/requests";
import { JwtAuthGuard } from "src/config/auth/jwtAuthGuard.config";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse, ApiConsumes } from "@nestjs/swagger";
import { LoginSuccessDTO, ResponsePayloadDTO } from "src/types/dtos/response.dtos";
import { ChangePasswordDTO, LoginPayloadDTO, UserDTO } from "src/types/dtos/request.dtos";

@ApiTags("usuarios")
@Controller("usuarios")
export class UserController {
    constructor(
        private readonly service: UserService
    ) {}

    
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Crea un nuevo usuario"
    })
    @ApiBody({ type: UserDTO })
    @ApiResponse({
        status: 201,
        description: "Usuario creado",
        type: ResponsePayloadDTO<User>
    })
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

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Retorna todos los usuarios registrados en el sistema",
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "usuarios encontrados",
        type: ResponsePayloadDTO<User[]>
    })
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

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Busca un usuario por su ID"
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Usuario encontrado",
        type: ResponsePayloadDTO<User>
    })
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

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Actualiza los datos de un usuario segun el ID"
    })
    @ApiBearerAuth()
    @ApiBody({
        type: UserDTO
    })
    @ApiResponse({
        status: 200,
        description: "Usuario actualizado",
        type: ResponsePayloadDTO<User>
    })
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

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Actualiza el contrato de un usuario",
    })
    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                    description: "Archivo PDF del contrato"
                }
            },
            required: ["file"]
        }
    })
    @ApiResponse({
        status: 200,
        description: "Contrato actualizado",
        type: ResponsePayloadDTO
    })
    @Put(":id/contrato")
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./uploads/contratos",
            filename: (_, file, cb) => cb(null, file.originalname)
        })
    }))
    async addOrReplaceContract(
        @Param("id", ParseIntPipe)
        id: number,
        @UploadedFile()
        file: Express.Multer.File
    ): Promise<responsePayload<User>> {
        try{
            const path = `/uploads/contratos/${file.originalname}`
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

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Agrega o reemplaza una liquidación"
    })
    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                    description: "Archivo PDF del contrato"
                }
            },
            required: ["file"]
        }
    })
    @ApiResponse({
        status: 200,
        description: "Liquidación agregada",
        type: ResponsePayloadDTO
    })
    @Put(":id/liquidaciones")
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./uploads/liquidaciones",
            filename: (_, file, cb) => cb(null, file.originalname)
        })
    }))
    async addLiquidation(
        @Param("id", ParseIntPipe)
        id: number,
        @UploadedFile()
        file: Express.Multer.File
    ): Promise<responsePayload<Liquidacion>> {
        try{
            const path = `/uploads/liquidaciones/${file.originalname}`
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

    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Entrega el contrato en base64"
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Contrato en Base64",
        type: ResponsePayloadDTO<{base64: string}>
    })
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

    @ApiOperation({
        summary: "Inicia sesión con credenciales"
    })
    @ApiBody({
        type: LoginPayloadDTO
    })
    @ApiResponse({
        status: 200,
        description: "Sesión iniciada",
        type: LoginSuccessDTO
    })
    @Post("login")
    async login(
        @Body()
        payload: loginPayload
    ): Promise<responsePayload<loginSuccess>> {
        try{
            const response: responsePayload<loginSuccess> = {
                message: "Sesión iniciada",
                data: {
                    token: await this.service.login(payload.rut, payload.password)
                },
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
        summary: "Descarga el contrato en formato pdf de un usuario"
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Contrato PDF descargado",
        type: ResponsePayloadDTO
    })
    @Get(":id/contrato")
    async downloadContract(
        @Param("id", ParseIntPipe)
        id: number,
        @Res()
        res: Response
    ): Promise<responsePayload<null>> {
        try{
            const user = await this.service.findById(id)
            if (!user || !user.contrato) throw new Error("Contrato no existente");
            const filePath = join(process.cwd(), user.contrato.replace(/^\//, ""))
            if(!existsSync(filePath)) {
                return {
                    message: "Contrato no existente",
                    error: true
                }
            }
            res.download(filePath, `${user.rut}_${user.id}.pdf`)
            return {
                message: "Contrato encontrado",
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
    @ApiOperation({
        summary: "Descarga una liquidación de un usuario"
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Liquidación PDF descargada",
        type: ResponsePayloadDTO
    })
    @Get(":id/liquidacion/:mes/:year")
    async downloadLiquidacion(
        @Param("id")
        id: number,
        @Param("mes")
        mes: string,
        @Param("year")
        year: string,
        @Res()
        res: Response
    ): Promise<responsePayload<null>> {
        try{
            const user = await this.service.findById(id)
            if(!user || !user.contrato) {
                return {
                    message: "Usuario o contrato no existente",
                    error: true
                }
            }
            const fileName = `${user.rut}_${user.id}_${mes}_${year}.pdf`
            const filePath = join(process.cwd(), "uploads", "liquidaciones", fileName)
            if(!existsSync(filePath)) {
                return {
                    message: "Liquidacion no existente",
                    error: true
                }
            }
            res.download(filePath, fileName)
            return {
                message: "Liquidación encontrada",
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
    @ApiOperation({
        summary: "Informa si el usuario tiene liquidaciones"
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Indica si el usuario tiene liquidaciones",
        type: ResponsePayloadDTO<boolean>
    })
    @Get(":id/has-liquidaciones")
    async hasLiquidaciones(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<boolean>> {
        try{
            const user = await this.service.findById(id)
            const hasLiquidaciones = !!(user && user.liquidaciones && user.liquidaciones.length > 0)
            return {
                message: "Consulta exitosa",
                data: hasLiquidaciones,
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
    @ApiOperation({
        summary: "Cambia la contraseña del usuario"
    })
    @ApiBody({
        description: "Requiere: clave antigua y nueva clave",
        required: true,
        type: ChangePasswordDTO
    })
    @ApiResponse({
        status: 200,
        description: "Informa si la operacion se realizo con exito",
        type: ResponsePayloadDTO
    })
    @Put(":id/change-password")
    async ChangePassword(
        @Param("id", ParseIntPipe)
        id: number,
        @Body()
        data: changePasswordPayload
    ): Promise<responsePayload<boolean>>{
        try{
            const response: responsePayload<boolean> = {
                message: "Clave cambiada",
                data: await this.service.changePassword(id, data.oldPassword, data.newPassword),
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
        summary: "Carga multiple de liquidaciones en formato PDF"
    })
    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                files: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "binary",
                        description: "Archivo PDF liquidacion"
                    }
                }
            },
            required: ["files"]
        }
    })
    @ApiResponse({
        status: 200,
        description: "Liquidaciones agregadas",
        type: ResponsePayloadDTO
    })
    @Put(":id/liquidaciones/multiple")
    @UseInterceptors(FilesInterceptor("files", 12, {
        storage: diskStorage({
            destination: "./uploads/liquidaciones",
            filename: (_, file, cb) => cb(null, file.originalname)
        }),
        fileFilter: (_, file, cb) => {
            if(file.mimetype === "application/pdf") cb(null, true);
            else cb(new Error("Los archivos deben estar en formato PDF"), false)
        }
    }))
    async UploadMultipleLiquidations(
        @Param("id", ParseIntPipe)
        id: number,
        @UploadedFiles()
        files: Express.Multer.File[]
    ): Promise<responsePayload<Liquidacion[]>> {
        try{
            if(!files || files.length < 1 || files.length > 12) throw new Error("Máximo de 12 archivos permitidos por carga");
            const liquidaciones: Liquidacion[] = []
            for(const file of files) {
                const path = `/uploads/liquidaciones/${file.originalname}`
                const liq = await this.service.addLiquidation(id, path)
                liquidaciones.push(liq)
            }
            return {
                message: "Liquidaciones agregadas",
                data: liquidaciones,
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
    @ApiOperation({
        summary: "Entrega todas las liquidaciones de un usuario"
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Liquidaciones encontradas",
        type: ResponsePayloadDTO<Liquidacion[]>
    })
    @Get(":id/liquidaciones")
    async GetUserLiquidations(
        @Param("id", ParseIntPipe)
        id: number
    ): Promise<responsePayload<Liquidacion[]>> {
        try{
            const user = await this.service.findById(id)
            if(!user) throw new Error("Usuario no existente");
            return {
                message: "Liquidaciones",
                data: user.liquidaciones,
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
    @ApiOperation({
        summary: "Descarga el contrato en formato pdf de un usuario"
    })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Contrato PDF descargado",
        type: ResponsePayloadDTO
    })
    @Get(":id/liquidacion/:lid")
    async downloadLiquidation(
        @Param("id", ParseIntPipe)
        id: number,
        @Param("lid", ParseIntPipe)
        lid: number,
        @Res()
        res: Response
    ): Promise<responsePayload<null>> {
        try{
            const user = await this.service.findById(id)
            if (!user || !user.liquidaciones) throw new Error("Usuario sin liquidaciones");
            const liquidacion = await this.service.getLiqByID(lid)
            const filePath = join(process.cwd(), liquidacion.path.replace(/^\//, ""))
            if(!existsSync(filePath)) {
                return {
                    message: "Liquidación no existente",
                    error: true
                }
            }
            res.download(filePath, liquidacion.path.split("/")[-1])
            return {
                message: "Liquidacion encontrada",
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