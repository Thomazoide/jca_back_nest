import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamsController } from "src/controllers/teams.controller";
import { Teams } from "src/models/teams.model";
import { User } from "src/models/users.model";
import { TeamService } from "src/services/teams.service";

@Module({
    imports: [TypeOrmModule.forFeature([Teams, User])],
    controllers: [TeamsController],
    providers: [TeamService]
})
export class TeamsModule {}