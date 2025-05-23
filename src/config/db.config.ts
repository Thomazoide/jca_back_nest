import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Liquidacion } from "src/models/liquidaciones.model";
import { Solicitud } from "src/models/solicitud.model";
import { User } from "src/models/users.model";

export const typeOrmConfig = (env: ConfigService): TypeOrmModuleOptions => ({
    type: "mysql",
    host: env.get<string>("DBHOST"),
    port: Number(env.get<string>("DBPORT")),
    username: env.get<string>("DBUSER"),
    password: env.get<string>("DBPASS"),
    entities: [Solicitud, User, Liquidacion],
    synchronize: true,
})