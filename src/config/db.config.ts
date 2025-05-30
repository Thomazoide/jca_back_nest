import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { LiqRequest } from "src/models/liqRequests";
import { Liquidacion } from "src/models/liquidaciones.model";
import { Solicitud } from "src/models/solicitud.model";
import { User } from "src/models/users.model";

export const typeOrmConfig = (env: ConfigService): TypeOrmModuleOptions => ({
    type: "mysql",
    host: env.get<string>("DBHOST"),
    port: Number(env.get<string>("DBPORT")),
    database: env.get<string>("DBNAME"),
    username: env.get<string>("DBUSER"),
    password: env.get<string>("DBPASS"),
    entities: [Solicitud, User, Liquidacion, LiqRequest],
    synchronize: true,
})