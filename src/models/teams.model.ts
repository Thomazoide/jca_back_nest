import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.model";

@Entity("equipos")
export class Teams {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column()
    supervisorID: number

    @OneToOne( () => User )
    @JoinColumn({name: "supervisorID"})
    supervisor: User

    @OneToMany( () => User, user => user.equipoGuardia, {nullable: true} )
    guardias: User[]
}