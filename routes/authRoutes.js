import express from 'express';
import { body } from 'express-validator';
import { renderLogin, loginUtilisateur } from '../controllers/UtilisateurController.js';

const router = express.Router();

router.get('/login', renderLogin);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('motDePasse').notEmpty().withMessage('Mot de passe requis'),
  ],
  loginUtilisateur
);

export default router;
