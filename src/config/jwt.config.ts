import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig = (env: ConfigService): JwtModuleOptions => ({
    secret: env.get<string>("SECRET"),
    signOptions: {
        expiresIn: "24h"
    }
})