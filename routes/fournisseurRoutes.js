import express from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import {
  listFournisseurs,
  renderAddFournisseur,
  addFournisseur,
  renderEditFournisseur,
  editFournisseur,
  deleteFournisseur,
} from '../controllers/FournisseurController.js';

const router = express.Router();

router.get('/', requireAuth, listFournisseurs);

router.get('/add', requireAuth, renderAddFournisseur);

router.post(
  '/',
  requireAuth,
  [
    body('nom').notEmpty().withMessage('Nom requis'),
    body('contactEmail').isEmail().withMessage('Email invalide'),
  ],
  addFournisseur
);

router.get('/:id/edit', requireAuth, renderEditFournisseur);

router.post(
  '/:id',
  requireAuth,
  [
    body('nom').notEmpty().withMessage('Nom requis'),
    body('contactEmail').isEmail().withMessage('Email invalide'),
  ],
  editFournisseur
);

router.delete('/:id', requireAuth, deleteFournisseur);

export default router;
