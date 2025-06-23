import { CARGOS } from "src/enums/cargos.enum";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Liquidacion } from "./liquidaciones.model";
import { Teams } from "./teams.model";

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
    birthDate: string

    @Column({default: null})
    picturePath: string

    @Column()
    cargo: CARGOS

    @OneToMany( () => Liquidacion, (liq) => liq.user )
    liquidaciones: Liquidacion[]

    @ManyToOne( () => Teams, team => team.guardias, {nullable: true} )
    equipoGuardia: Teams

    public toSignData(): Partial<User> {
        return {
            id: this.id,
            fullName: this.fullName,
            email: this.email,
            rut: this.email,
            cargo: this.cargo,
            isAdmin: this.isAdmin,
            birthDate: this.birthDate,
        }
    }
}