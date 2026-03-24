// controllers/FournisseurController.js
import Fournisseur from '../models/Fournisseur.js'
import { body, validationResult } from 'express-validator'

// -------------------------------------------------------
// Validations
// -------------------------------------------------------
export const validateFournisseur = [
  body('nom')
    .notEmpty().withMessage('Le nom du fournisseur est requis.')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères.')
    .trim(),
  body('contactEmail')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Format d\'email invalide.')
    .normalizeEmail()
]

// -------------------------------------------------------
// 1. GET /api/fournisseurs — Tous les fournisseurs (avec pagination)
// -------------------------------------------------------
export const getAllFournisseurs = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await Fournisseur.findAndCountAll({ limit, offset })

    res.status(200).json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// -------------------------------------------------------
// 2. GET /api/fournisseurs/:id — Un fournisseur par ID
// -------------------------------------------------------
export const getFournisseurById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await Fournisseur.findByPk(id)
    if (!result) {
      return res.status(404).json({ message: 'Fournisseur non trouvé.' })
    }
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// -------------------------------------------------------
// 3. POST /api/fournisseurs — Créer un fournisseur
// -------------------------------------------------------
export const addFournisseur = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const result = await Fournisseur.create({
      nom: req.body.nom,
      contactEmail: req.body.contactEmail || null
    })
    res.status(201).json({ data: result, message: 'Fournisseur créé avec succès.' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// -------------------------------------------------------
// 4. PUT /api/fournisseurs/:id — Mettre à jour un fournisseur
// -------------------------------------------------------
export const updateFournisseur = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  try {
    const [updatedRows] = await Fournisseur.update(
      { nom: req.body.nom, contactEmail: req.body.contactEmail || null },
      { where: { id } }
    )
    if (updatedRows === 0) {
      return res.status(404).json({ message: `Fournisseur avec l'ID ${id} non trouvé.` })
    }
    res.status(200).json({ message: `Fournisseur ${id} mis à jour avec succès.` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// -------------------------------------------------------
// 5. DELETE /api/fournisseurs/:id — Supprimer un fournisseur
// -------------------------------------------------------
export const deleteFournisseur = async (req, res) => {
  const { id } = req.params
  try {
    const deletedRows = await Fournisseur.destroy({ where: { id: parseInt(id) } })
    if (deletedRows === 0) {
      return res.status(404).json({ message: `Fournisseur avec l'ID ${id} non trouvé.` })
    }
    res.status(200).json({ message: `Fournisseur ${id} supprimé avec succès.` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
