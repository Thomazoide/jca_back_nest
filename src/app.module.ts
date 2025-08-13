import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/users.module';
import { AccountRequestsModule } from './modules/solicitud.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/db.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config';
import { JwtStrategy } from './config/auth/jwtStrategy.config';
import { LiqRequestsModule } from './modules/liqRequests.module';
import { TeamsModule } from './modules/teams.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
      global: true
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    AccountRequestsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig
    }),
    LiqRequestsModule,
    TeamsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy
  ],
})
export class AppModule {}
