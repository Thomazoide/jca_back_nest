import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.model";

@Entity("liquidaciones")
export class Liquidacion {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    path: string

    @Column({nullable: true})
    userId: number

    @ManyToOne( () => User, (user) => user.liquidaciones )
    @JoinColumn({name: "userId"})
    user: User
}