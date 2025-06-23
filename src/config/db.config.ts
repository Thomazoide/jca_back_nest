import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { LiqRequest } from "src/models/liqRequests";
import { Liquidacion } from "src/models/liquidaciones.model";
import { Solicitud } from "src/models/solicitud.model";
import { Teams } from "src/models/teams.model";
import { User } from "src/models/users.model";

export const typeOrmConfig = (env: ConfigService): TypeOrmModuleOptions => ({
    type: "mariadb",
    port: Number(env.get<string>("DBPORT")),
    host: env.get<string>("DBHOST"),
    database: env.get<string>("DBNAME"),
    username: env.get<string>("DBUSER"),
    password: env.get<string>("DBPASS"),
    entities: [Solicitud, User, Liquidacion, LiqRequest, Teams],
    synchronize: true,
})