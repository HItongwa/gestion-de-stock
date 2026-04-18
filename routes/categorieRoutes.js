import express from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import {
  listCategories,
  renderAddCategorie,
  addCategorie,
  renderEditCategorie,
  editCategorie,
  deleteCategorie,
} from '../controllers/CategorieController.js';

const router = express.Router();

router.get('/', requireAuth, listCategories);

router.get('/add', requireAuth, renderAddCategorie);

router.post(
  '/',
  requireAuth,
  [
    body('nom').notEmpty().withMessage('Nom requis'),
  ],
  addCategorie
);

router.get('/:id/edit', requireAuth, renderEditCategorie);

router.post(
  '/:id',
  requireAuth,
  [
    body('nom').notEmpty().withMessage('Nom requis'),
  ],
  editCategorie
);

router.delete('/:id', requireAuth, deleteCategorie);

export default router;
