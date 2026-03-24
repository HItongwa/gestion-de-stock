// controllers/HistoriqueStockController.js
import HistoriqueStock from '../models/HistoriqueStock.js'
import Produit from '../models/Produit.js'
import Utilisateur from '../models/Utilisateur.js'
import { body, validationResult } from 'express-validator'

export const validateMouvement = [
  body('produitId').notEmpty().withMessage('produitId est requis.').isInt({ min: 1 }).withMessage('produitId doit être un entier valide.'),
  body('quantiteChangee').notEmpty().withMessage('quantiteChangee est requis.').isInt().withMessage('quantiteChangee doit être un entier (positif = entrée, négatif = sortie).')
]

// GET /api/stock/historique — Tout l'historique avec pagination
export const getAllHistorique = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await HistoriqueStock.findAndCountAll({
      include: [Produit, { model: Utilisateur, attributes: { exclude: ['motDePasse'] } }],
      order: [['date', 'DESC']],
      limit, offset
    })
    res.status(200).json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/stock/historique — Enregistrer un mouvement (utilise JWT)
export const addMouvementStock = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  // L'ID utilisateur vient du token JWT (req.utilisateur injecté par le middleware)
  const utilisateurId = req.utilisateur.id
  const { produitId, quantiteChangee } = req.body
  const mouvement = parseInt(quantiteChangee)

  try {
    const produit = await Produit.findByPk(produitId)
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé.' })

    const nouvelleQuantite = produit.quantite + mouvement
    if (nouvelleQuantite < 0) {
      return res.status(400).json({ message: `Stock insuffisant. Stock actuel : ${produit.quantite}` })
    }

    const mouvementEnregistre = await HistoriqueStock.create({ produitId, quantiteChangee: mouvement, utilisateurId })
    await Produit.update({ quantite: nouvelleQuantite }, { where: { id: produitId } })

    res.status(201).json({
      data: mouvementEnregistre,
      message: `Mouvement enregistré. Nouveau stock du produit ${produitId} : ${nouvelleQuantite}`
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// GET /api/stock/historique/produit/:idProduit
export const getHistoriqueByProduit = async (req, res) => {
  const { idProduit } = req.params
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await HistoriqueStock.findAndCountAll({
      where: { produitId: idProduit },
      include: [Produit, { model: Utilisateur, attributes: { exclude: ['motDePasse'] } }],
      order: [['date', 'DESC']],
      limit, offset
    })
    res.status(200).json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
