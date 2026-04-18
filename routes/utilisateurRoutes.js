import express from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import {
  listUtilisateurs,
  renderAddUtilisateur,
  addUtilisateur,
  renderEditUtilisateur,
  editUtilisateur,
  deleteUtilisateur,
} from '../controllers/UtilisateurController.js';

const router = express.Router();

router.get('/', requireAuth, listUtilisateurs);

router.get('/add', requireAuth, renderAddUtilisateur);

router.post(
  '/',
  requireAuth,
  [
    body('nom').notEmpty().withMessage('Nom requis'),
    body('prenom').notEmpty().withMessage('Prénom requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('motDePasse').isLength({ min: 6 }).withMessage('Mot de passe minimum 6 caractères'),
    body('roleId').notEmpty().withMessage('Rôle requis'),
  ],
  addUtilisateur
);

router.get('/:id/edit', requireAuth, renderEditUtilisateur);

router.post(
  '/:id',
  requireAuth,
  [
    body('nom').notEmpty().withMessage('Nom requis'),
    body('prenom').notEmpty().withMessage('Prénom requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('roleId').notEmpty().withMessage('Rôle requis'),
  ],
  editUtilisateur
);

router.delete('/:id', requireAuth, deleteUtilisateur);

export default router;
