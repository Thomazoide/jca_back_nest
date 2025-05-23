import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("solicitudes")
export class Solicitud {
    @PrimaryGeneratedColumn()
    id: number
    @Column({unique: true})
    email: string
    @Column({unique: true})
    rut: string
    @Column({default: false})
    ignored: boolean
    @Column({default: false})
    completed: boolean
}