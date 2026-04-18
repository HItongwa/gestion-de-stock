import express from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import {
  listProduits,
  renderAddProduit,
  addProduit,
  renderEditProduit,
  editProduit,
  deleteProduit,
} from '../controllers/ProduitController.js';

const router = express.Router();

router.get('/', requireAuth, listProduits);

router.get('/add', requireAuth, renderAddProduit);

router.post(
  '/',
  requireAuth,
  [
    body('nom').notEmpty().withMessage('Nom requis'),
    body('categorieId').notEmpty().withMessage('Catégorie requise'),
    body('fournisseurId').notEmpty().withMessage('Fournisseur requis'),
    body('prix').isFloat({ min: 0 }).withMessage('Prix invalide'),
    body('quantite').isInt({ min: 0 }).withMessage('Quantité invalide'),
    body('sku').notEmpty().withMessage('SKU requis'),
  ],
  addProduit
);

router.get('/:id/edit', requireAuth, renderEditProduit);

router.post(
  '/:id',
  requireAuth,
  [
    body('nom').notEmpty().withMessage('Nom requis'),
    body('categorieId').notEmpty().withMessage('Catégorie requise'),
    body('fournisseurId').notEmpty().withMessage('Fournisseur requis'),
    body('prix').isFloat({ min: 0 }).withMessage('Prix invalide'),
    body('quantite').isInt({ min: 0 }).withMessage('Quantité invalide'),
  ],
  editProduit
);

router.delete('/:id', requireAuth, deleteProduit);

export default router;
