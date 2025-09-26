import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';

const noteRouter = Router();

// Rota para criar uma nova nota (PROTEGIDA)
noteRouter.post(
  '/notes',
  authMiddleware, // <-- AQUI! O middleware é executado primeiro
  (req, res) => {
    // Se chegou aqui, o token é válido.
    // O ID do usuário está disponível em req.user.id
    const userId = req.user?.id;
    res.json({ message: `Usuário ${userId} está criando uma nota.`, body: req.body });
  }
);

// Rota para buscar todas as notas do usuário (PROTEGIDA)
noteRouter.get(
  '/notes',
  authMiddleware, // <-- Protegendo a rota GET também
  (req, res) => {
    const userId = req.user?.id;
    res.json({ message: `Buscando notas para o usuário ${userId}.` });
  }
);

export { noteRouter };
