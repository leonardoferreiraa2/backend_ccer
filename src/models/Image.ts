/* import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Sala } from './Sala';

@Entity("images")
class Image {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    path: string;

    @ManyToOne(() => Sala, sala => sala.images)
    @JoinColumn({ name: 'sala_id' })
    sala: Sala
}

export { Image } */