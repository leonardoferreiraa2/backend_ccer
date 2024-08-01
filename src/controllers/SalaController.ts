import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Sala } from "../models/Sala";
import SalaView from '../views/salas_view';
import "./database";

class SalaController {
    static readonly totalPags: number = 10;
    
    async create(request: Request, response: Response) {
        const { 
            titulo, 
            texto, 
            urlAudio, 
            urlFoto, 
            urlVideo
        } = request.body;
        
        const salaRepository = getRepository(Sala);
        
        try {
            // Verifica se já existe uma sala com o mesmo texto
            const salaExistente = await salaRepository.findOne({ titulo });

            if (salaExistente) {
                return response.status(400).json({ error: "Sala já existe!" });
            };

            const requestImage = request.files as Express.Multer.File[];
            const images = requestImage.map(image => {
                return { path: image.filename }
            });

            // Cria uma nova sala com os dados fornecidos
            const novaSala = salaRepository.create({
                titulo,
                texto,
                urlAudio,
                urlFoto,
                urlVideo,
                //images
            });

            // Salva a nova sala no banco de dados
            await salaRepository.save(novaSala);

            // Retorna a nova sala criada como resposta
            return response.status(201).json(SalaView.render(novaSala));
        } catch (error) {
            // Se ocorrer um erro, retorna um status 500 com uma mensagem de erro
            return response.status(500).json({ error: error.message });
        }
    }

    async update(request: Request, response: Response) {
        const { 
            id, 
            titulo, 
            texto, 
            urlAudio, 
            urlFoto, 
            urlVideo 
        } = request.body;
    
        const salaRepository = getRepository(Sala);
    
        // Verifica se já existe uma sala com o mesmo título (exceto a sala que está sendo atualizada)
        const salaExistente = await salaRepository.createQueryBuilder("sala")
            .where("sala.titulo = :titulo", { titulo })
            .andWhere("sala.id != :id", { id })
            .getOne();
    
        if (salaExistente) {
            return response.status(400).json({ error: "Sala com este título já existe!" });
        }
    
        // Verifica se a sala existe pelo ID
        const salaFind = await salaRepository.findOne(id, { relations: ["images"] });
    
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
        await salaRepository.save(salaFind);
    
        // Retorna a sala atualizada como resposta
        return response.json(SalaView.render(salaFind));
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const salaRepository = getRepository(Sala);

        try {
            const getSala = await salaRepository.findOne(id, { relations: ["images"] });

            if (!getSala) {
                return response.status(404).json({ error: "Sala não encontrada!" });
            }

            return response.json(SalaView.render(getSala));
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }

    async showAll(request: Request, response: Response) {
        const { termo } = request.body;
        const { pag } = request.params;

        const pagina = parseInt(pag as string, 10) || 1; // Página atual, default para 1 se não fornecida

        const salaRepository = getRepository(Sala);

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
            const salas = await queryBuilder.getMany();

            // Verifica se há resultados
            if (salas.length === 0) {
                return response.status(404).json({ error: "Não há salas para exibir nesta página!" });
            }

            return response.json(SalaView.renderMany(salas));
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }
    
    async countPags(request: Request, response: Response) {
        const { termo } = request.body;

        const salaRepository = getRepository(Sala);

        try {
            let totalRegistros: number;

            if (termo) {
                // Conta o número total de registros na tabela que correspondem ao termo fornecido
                totalRegistros = await salaRepository
                    .createQueryBuilder("sala")
                    .where("sala.titulo LIKE :termo", { termo: `%${termo}%` })
                    .orWhere("sala.texto LIKE :termo", { termo: `%${termo}%` })
                    // Adicione mais campos conforme necessário
                    .getCount();
            } else {
                // Conta o número total de registros na tabela
                totalRegistros = await salaRepository.count();
            }

            // Calcula o total de páginas com base em 50 registros por página
            const totalPages = Math.ceil(totalRegistros / SalaController.totalPags);

            return response.json({ totalPages });
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
    
        const salaRepository = getRepository(Sala);
    
        try {
            const getSala = await salaRepository.findOne({ id: id });
    
            if (!getSala) {
                return response.status(404).json({ error: "Sala não encontrada!" });
            }
    
            await salaRepository.remove(getSala);
    
            return response.json({ message: "Sala deletada com sucesso!" });
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    }    
}

export { SalaController }