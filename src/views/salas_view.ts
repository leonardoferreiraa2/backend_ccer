import { Sala } from '../models/Sala';
//import ImagesView from '../views/images_view';

export default {
    render(sala: Sala) {
        return{
            id: sala.id,
            titulo: sala.titulo,
            texto: sala.texto,
            urlAudio: sala.urlAudio,
            urlFoto: sala.urlFoto,
            urlVideo: sala.urlVideo,
            //images: ImagesView.renderMany(sala.images)
        }
    },

    renderMany(salas: Sala[]) {
        return salas.map(sala => this.render(sala))
    }
};