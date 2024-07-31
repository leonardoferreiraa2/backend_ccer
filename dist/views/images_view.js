"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    render(image) {
        return {
            id: image.id,
            url: `https://backend-ccer.vercel.app/uploads/${image.path}`
        };
    },
    renderMany(images) {
        return images.map(image => this.render(image));
    }
};
