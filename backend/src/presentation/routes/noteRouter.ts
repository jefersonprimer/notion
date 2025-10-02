import { Router } from 'express';
import { noteController } from '../../main/factories/noteFactory';
import { authMiddleware } from '../middlewares/authMiddleware';

const noteRouter = Router();

// Apply the auth middleware to all routes in this router
noteRouter.use(authMiddleware);

// --- Notes Routes ---
noteRouter.get('/', (req, res) => noteController.list(req, res));
noteRouter.post('/', (req, res) => noteController.create(req, res));

// This needs to be before the /:id route to be matched correctly
noteRouter.get('/search', (req, res) => noteController.search(req, res));

noteRouter.get('/favorites', (req, res) => noteController.listFavorites(req, res));

// --- Trash Routes ---
// This needs to be before the /:id route to be matched correctly
noteRouter.get('/trash', (req, res) => noteController.listDeleted(req, res));

// --- Single Note Routes ---
noteRouter.get('/:id', (req, res) => noteController.getById(req, res));
noteRouter.get('/:parentId/children', (req, res) => noteController.listChildren(req, res));
noteRouter.put('/:id', (req, res) => noteController.update(req, res));
noteRouter.patch('/:id/favorite', (req, res) => noteController.favorite(req, res));
noteRouter.delete('/:id', (req, res) => noteController.softDelete(req, res)); // Soft delete
noteRouter.post('/:id/restore', (req, res) => noteController.restore(req, res));
noteRouter.delete('/:id/permanent', (req, res) => noteController.permanentDelete(req, res));

export { noteRouter };
