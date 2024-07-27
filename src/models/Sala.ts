import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { Image } from './Image';

@Entity("salas")
class Sala {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    titulo: string;

    @Column()
    texto: string;

    @Column()
    urlAudio: string;

    @Column()
    urlFoto: string;

    @Column()
    urlVideo: string;

    @OneToMany(() => Image, image => image.sala, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'sala_id' })
    images: Image[];
}

export { Sala }