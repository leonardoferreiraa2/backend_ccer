"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaController = void 0;
const typeorm_1 = require("typeorm");
const Sala_1 = require("../models/Sala");
const Image_1 = require("../models/Image");
const salas_view_1 = __importDefault(require("../views/salas_view"));
class SalaController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { titulo, texto, urlAudio, urlFoto, urlVideo } = request.body;
            const salaRepository = (0, typeorm_1.getRepository)(Sala_1.Sala);
            try {
                // Verifica se já existe uma sala com o mesmo texto
                const salaExistente = yield salaRepository.findOne({ titulo });
                if (salaExistente) {
                    return response.status(400).json({ error: "Sala já existe!" });
                }
                ;
                const requestImage = request.files;
                const images = requestImage.map(image => {
                    return { path: image.filename };
                });
                // Cria uma nova sala com os dados fornecidos
                const novaSala = salaRepository.create({
                    titulo,
                    texto,
                    urlAudio,
                    urlFoto,
                    urlVideo,
                    images
                });
                // Salva a nova sala no banco de dados
                yield salaRepository.save(novaSala);
                // Retorna a nova sala criada como resposta
                return response.status(201).json(salas_view_1.default.render(novaSala));
            }
            catch (error) {
                // Se ocorrer um erro, retorna um status 500 com uma mensagem de erro
                return response.status(500).json({ error: error.message });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, titulo, texto, urlAudio, urlFoto, urlVideo } = request.body;
            const salaRepository = (0, typeorm_1.getRepository)(Sala_1.Sala);
            const imageRepository = (0, typeorm_1.getRepository)(Image_1.Image);
            // Verifica se já existe uma sala com o mesmo título (exceto a sala que está sendo atualizada)
            const salaExistente = yield salaRepository.createQueryBuilder("sala")
                .where("sala.titulo = :titulo", { titulo })
                .andWhere("sala.id != :id", { id })
                .getOne();
            if (salaExistente) {
                return response.status(400).json({ error: "Sala com este título já existe!" });
            }
            // Verifica se a sala existe pelo ID
            const salaFind = yield salaRepository.findOne(id, { relations: ["images"] });
            if (!salaFind) {
                return response.status(404).json({ error: "Sala não encontrada!" });
            }
            // Atualiza os campos da sala existente
            salaFind.titulo = titulo;
            salaFind.texto = texto;
            salaFind.urlAudio = urlAudio;
            salaFind.urlFoto = urlFoto;
            salaFind.urlVideo = urlVideo;
            // Salva as alterações no banco de dados
            yield salaRepository.save(salaFind);
            // Retorna a sala atualizada como resposta
            return response.json(salas_view_1.default.render(salaFind));
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const salaRepository = (0, typeorm_1.getRepository)(Sala_1.Sala);
            try {
                const getSala = yield salaRepository.findOne(id, { relations: ["images"] });
                if (!getSala) {
                    return response.status(404).json({ error: "Sala não encontrada!" });
                }
                return response.json(salas_view_1.default.render(getSala));
            }
            catch (error) {
                return response.status(500).json({ error: error.message });
            }
        });
    }
    showAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { termo } = request.body;
            const { pag } = request.params;
            const pagina = parseInt(pag, 10) || 1; // Página atual, default para 1 se não fornecida
            const salaRepository = (0, typeorm_1.getRepository)(Sala_1.Sala);
            try {
                const skip = (pagina - 1) * SalaController.totalPags; // Registros a pular
                const take = SalaController.totalPags; // Registros por página
                let queryBuilder = salaRepository.createQueryBuilder("sala")
                    .leftJoinAndSelect("sala.images", "images")
                    .skip(skip)
                    .take(take)
                    .orderBy("sala.id", "ASC"); // Ordenação por exemplo, pode ser ajustada conforme necessário
                // Se o termo de busca foi fornecido na query, adiciona cláusulas WHERE para todos os campos relevantes
                if (termo) {
                    queryBuilder = queryBuilder
                        .where("sala.titulo LIKE :termo", { termo: `%${termo}%` })
                        .orWhere("sala.texto LIKE :termo", { termo: `%${termo}%` });
                    // Adicione mais campos conforme necessário
                }
                // Executa a consulta
                const salas = yield queryBuilder.getMany();
                // Verifica se há resultados
                if (salas.length === 0) {
                    return response.status(404).json({ error: "Não há salas para exibir nesta página!" });
                }
                return response.json(salas_view_1.default.renderMany(salas));
            }
            catch (error) {
                return response.status(500).json({ error: error.message });
            }
        });
    }
    countPags(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { termo } = request.body;
            const salaRepository = (0, typeorm_1.getRepository)(Sala_1.Sala);
            try {
                let totalRegistros;
                if (termo) {
                    // Conta o número total de registros na tabela que correspondem ao termo fornecido
                    totalRegistros = yield salaRepository
                        .createQueryBuilder("sala")
                        .where("sala.titulo LIKE :termo", { termo: `%${termo}%` })
                        .orWhere("sala.texto LIKE :termo", { termo: `%${termo}%` })
                        // Adicione mais campos conforme necessário
                        .getCount();
                }
                else {
                    // Conta o número total de registros na tabela
                    totalRegistros = yield salaRepository.count();
                }
                // Calcula o total de páginas com base em 50 registros por página
                const totalPages = Math.ceil(totalRegistros / SalaController.totalPags);
                return response.json({ totalPages });
            }
            catch (error) {
                return response.status(500).json({ error: error.message });
            }
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const salaRepository = (0, typeorm_1.getRepository)(Sala_1.Sala);
            try {
                const getSala = yield salaRepository.findOne({ id: id });
                if (!getSala) {
                    return response.status(404).json({ error: "Sala não encontrada!" });
                }
                yield salaRepository.remove(getSala);
                return response.json({ message: "Sala deletada com sucesso!" });
            }
            catch (error) {
                return response.status(500).json({ error: error.message });
            }
        });
    }
}
exports.SalaController = SalaController;
SalaController.totalPags = 10;
