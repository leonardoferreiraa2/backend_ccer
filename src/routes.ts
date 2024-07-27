import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';
import { SalaController } from './controllers/SalaController';

const salaController = new SalaController();

const router = Router();
const upload = multer(uploadConfig);

router.get("/salas/pagina/:pag", salaController.showAll);
router.get("/salas/totalpaginas", salaController.countPags);
router.get("/salas/:id", salaController.show);
router.post("/salas/salvar", upload.array('images'), salaController.create);
router.put("/salas/atualizar", upload.array('images'), salaController.update);
router.delete("/salas/deletar/:id", salaController.delete);

export { router };