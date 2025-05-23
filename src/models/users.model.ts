import { CARGOS } from "src/enums/cargos.enum";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Liquidacion } from "./liquidaciones.model";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    fullName: string

    @Column({ unique: true })
    email: string

    @Column({ unique: true })
    rut: string

    @Column()
    password: string

    @Column({ default: false })
    isAdmin: boolean

    @Column({nullable: true, default: null})
    contrato: string

    @Column()
    cargo: CARGOS

    @OneToMany( () => Liquidacion, (liq) => liq.user )
    liquidaciones: Liquidacion[]
}