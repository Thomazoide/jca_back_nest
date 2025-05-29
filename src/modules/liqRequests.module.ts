import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LiqRequestController } from "src/controllers/liqRequests.controller";
import { LiqRequest } from "src/models/liqRequests";
import { LiqRequestService } from "src/services/liqRequests.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([LiqRequest])
    ],
    controllers: [
        LiqRequestController
    ],
    providers: [
        LiqRequestService
    ],
    exports: [
        LiqRequestService
    ]
})
export class LiqRequestsModule {}