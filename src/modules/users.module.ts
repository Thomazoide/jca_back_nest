import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "src/controllers/user.controller";
import { Encrypter } from "src/middleware/encrypter.middleware";
import { Liquidacion } from "src/models/liquidaciones.model";
import { User } from "src/models/users.model";
import { UserService } from "src/services/user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Liquidacion]),
        MulterModule,
    ],
    controllers: [UserController],
    providers: [UserService, Encrypter],
    exports: [UserService, Encrypter]
})
export class UserModule {}