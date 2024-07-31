"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const images_view_1 = __importDefault(require("../views/images_view"));
exports.default = {
    render(sala) {
        return {
            id: sala.id,
            titulo: sala.titulo,
            texto: sala.texto,
            urlAudio: sala.urlAudio,
            urlFoto: sala.urlFoto,
            urlVideo: sala.urlVideo,
            images: images_view_1.default.renderMany(sala.images)
        };
    },
    renderMany(salas) {
        return salas.map(sala => this.render(sala));
    }
};
