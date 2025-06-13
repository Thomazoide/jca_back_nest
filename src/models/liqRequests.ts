import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("solicitudes_liquidaciones")
export class LiqRequest {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    message: string
    @Column({default: false})
    completada: boolean
    @Column()
    userID: number
}