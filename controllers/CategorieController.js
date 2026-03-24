// controllers/CategorieController.js
import Categorie from '../models/Categorie.js'
import { body, validationResult } from 'express-validator'

// -------------------------------------------------------
// Validations
// -------------------------------------------------------
export const validateCategorie = [
  body('nom')
    .notEmpty().withMessage('Le nom de la catégorie est requis.')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères.')
    .trim()
]

// -------------------------------------------------------
// 1. GET /api/categories — Toutes les catégories (avec pagination)
// -------------------------------------------------------
export const getAllCategories = async (req, res) => {
  try {
    // Pagination via query params : ?page=1&limit=10
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await Categorie.findAndCountAll({ limit, offset })

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
// 2. GET /api/categories/:id — Une catégorie par ID
// -------------------------------------------------------
export const getCategorieById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await Categorie.findByPk(id)
    if (!result) {
      return res.status(404).json({ message: 'Catégorie non trouvée.' })
    }
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// -------------------------------------------------------
// 3. POST /api/categories — Créer une catégorie
// -------------------------------------------------------
export const addCategorie = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const result = await Categorie.create({ nom: req.body.nom })
    res.status(201).json({ data: result, message: 'Catégorie créée avec succès.' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// -------------------------------------------------------
// 4. PUT /api/categories/:id — Mettre à jour une catégorie
// -------------------------------------------------------
export const updateCategorie = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  try {
    const [updatedRows] = await Categorie.update({ nom: req.body.nom }, { where: { id } })
    if (updatedRows === 0) {
      return res.status(404).json({ message: `Catégorie avec l'ID ${id} non trouvée.` })
    }
    res.status(200).json({ message: `Catégorie ${id} mise à jour avec succès.` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// -------------------------------------------------------
// 5. DELETE /api/categories/:id — Supprimer une catégorie
// -------------------------------------------------------
export const deleteCategorie = async (req, res) => {
  const { id } = req.params
  try {
    const deletedRows = await Categorie.destroy({ where: { id } })
    if (deletedRows === 0) {
      return res.status(404).json({ message: `Catégorie avec l'ID ${id} non trouvée.` })
    }
    res.status(200).json({ message: `Catégorie ${id} supprimée avec succès.` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
