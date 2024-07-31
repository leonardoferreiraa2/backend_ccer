import { Image } from '../models/Image';

export default {
    render(image: Image) {
        return{
            id: image.id,
            url: `https://backend-ccer.vercel.app/uploads/${image.path}` 
        }
    },

    renderMany(images: Image[]) {
        return images.map(image => this.render(image))
    }
};