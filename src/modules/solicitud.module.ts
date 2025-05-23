import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountRequestController } from "src/controllers/solicitudes.controller";
import { Solicitud } from "src/models/solicitud.model";
import { AccountRequestService } from "src/services/solicitudes.service";

@Module({
    imports: [TypeOrmModule.forFeature([Solicitud])],
    controllers: [AccountRequestController],
    providers: [AccountRequestService],
    exports: [AccountRequestService]
})
export class AccountRequestsModule {}