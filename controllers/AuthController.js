// controllers/AuthController.js
import Utilisateur from '../models/Utilisateur.js'
import Role from '../models/Role.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { body, validationResult } from 'express-validator'

dotenv.config()

// -------------------------------------------------------
// Validations pour le login
// -------------------------------------------------------
export const validateLogin = [
  body('email')
    .notEmpty().withMessage('L\'email est requis.')
    .isEmail().withMessage('Format d\'email invalide.'),
  body('motDePasse')
    .notEmpty().withMessage('Le mot de passe est requis.')
    .isLength({ min: 4 }).withMessage('Le mot de passe doit contenir au moins 4 caractères.')
]

// -------------------------------------------------------
// POST /api/auth/login — Connexion et génération du token JWT
// -------------------------------------------------------
export const loginAPI = async (req, res) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, motDePasse } = req.body

  try {
    // 1. Chercher l'utilisateur avec son rôle
    const utilisateur = await Utilisateur.findOne({
      where: { email },
      include: [Role]
    })

    if (!utilisateur) {
      return res.status(401).json({ message: 'Email introuvable.' })
    }

    // 2. Vérifier le mot de passe
    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse)
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' })
    }

    // 3. Créer le token JWT (expire dans 24h)
    const token = jwt.sign(
      {
        id: utilisateur.id,
        email: utilisateur.email,
        nom: utilisateur.nom,
        roleId: utilisateur.roleId
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.Role ? utilisateur.Role.nom : null
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur : ' + error.message })
  }
}
