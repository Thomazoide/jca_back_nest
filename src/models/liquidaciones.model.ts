import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.model";

@Entity("liquidaciones")
export class Liquidacion {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    path: string

    @ManyToOne( () => User, (user) => user.liquidaciones )
    user: User
}