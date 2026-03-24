// controllers/ProduitController.js
import Produit from '../models/Produit.js'
import Categorie from '../models/Categorie.js'
import Fournisseur from '../models/Fournisseur.js'
import { body, validationResult } from 'express-validator'

export const validateProduit = [
  body('nom').notEmpty().withMessage('Le nom est requis.').isLength({ min: 2, max: 100 }).withMessage('Entre 2 et 100 caractères.').trim(),
  body('quantite').notEmpty().withMessage('La quantité est requise.').isInt({ min: 0 }).withMessage('La quantité doit être un entier >= 0.'),
  body('prix').notEmpty().withMessage('Le prix est requis.').isDecimal({ decimal_digits: '0,2' }).withMessage('Le prix doit être un nombre décimal valide.'),
  body('categorieId').notEmpty().withMessage('La catégorie est requise.').isInt({ min: 1 }).withMessage('categorieId doit être un entier valide.'),
  body('fournisseurId').notEmpty().withMessage('Le fournisseur est requis.').isInt({ min: 1 }).withMessage('fournisseurId doit être un entier valide.')
]

export const getAllProduits = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await Produit.findAndCountAll({
      include: [Categorie, Fournisseur],
      limit,
      offset
    })

    res.status(200).json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProduitById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await Produit.findByPk(id, { include: [Categorie, Fournisseur] })
    if (!result) return res.status(404).json({ message: 'Produit non trouvé.' })
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addProduit = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  try {
    const result = await Produit.create({
      nom: req.body.nom,
      quantite: req.body.quantite || 0,
      prix: req.body.prix,
      categorieId: req.body.categorieId,
      fournisseurId: req.body.fournisseurId
    })
    res.status(201).json({ data: result, message: 'Produit créé avec succès.' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateProduit = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { id } = req.params
  try {
    const [updatedRows] = await Produit.update({
      nom: req.body.nom,
      quantite: req.body.quantite,
      prix: req.body.prix,
      categorieId: req.body.categorieId,
      fournisseurId: req.body.fournisseurId
    }, { where: { id } })
    if (updatedRows === 0) return res.status(404).json({ message: `Produit ${id} non trouvé.` })
    res.status(200).json({ message: `Produit ${id} mis à jour avec succès.` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteProduit = async (req, res) => {
  const { id } = req.params
  try {
    const deletedRows = await Produit.destroy({ where: { id } })
    if (deletedRows === 0) return res.status(404).json({ message: `Produit ${id} non trouvé.` })
    res.status(200).json({ message: `Produit ${id} supprimé avec succès.` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// ---- FRONTEND (EJS) ----
export const renderListProduits = async (req, res) => {
  try {
    const produits = await Produit.findAll({ include: [Categorie, Fournisseur] })
    res.render('produits/list', { produits })
  } catch (error) {
    res.status(500).send('Erreur : ' + error.message)
  }
}

export const renderAddProduit = async (req, res) => {
  try {
    const categories = await Categorie.findAll()
    const fournisseurs = await Fournisseur.findAll()
    res.render('produits/add', { categories, fournisseurs })
  } catch (error) {
    res.status(500).send('Erreur : ' + error.message)
  }
}

export const addProduitFrontend = async (req, res) => {
  try {
    await Produit.create({
      nom: req.body.nom,
      quantite: req.body.quantite || 0,
      prix: req.body.prix,
      categorieId: req.body.categorieId,
      fournisseurId: req.body.fournisseurId
    })
    res.redirect('/produits')
  } catch (error) {
    res.status(400).send('Erreur : ' + error.message)
  }
}

export const renderEditProduit = async (req, res) => {
  const { id } = req.params
  try {
    const produit = await Produit.findByPk(id)
    const categories = await Categorie.findAll()
    const fournisseurs = await Fournisseur.findAll()
    if (!produit) return res.status(404).send('Produit introuvable')
    res.render('produits/edit', { produit, categories, fournisseurs })
  } catch (error) {
    res.status(500).send('Erreur : ' + error.message)
  }
}

export const updateProduitFrontend = async (req, res) => {
  const { id } = req.params
  try {
    await Produit.update({
      nom: req.body.nom,
      quantite: req.body.quantite,
      prix: req.body.prix,
      categorieId: req.body.categorieId,
      fournisseurId: req.body.fournisseurId
    }, { where: { id } })
    res.redirect('/produits')
  } catch (error) {
    res.status(400).send('Erreur : ' + error.message)
  }
}

export const deleteProduitFrontend = async (req, res) => {
  const { id } = req.params
  try {
    await Produit.destroy({ where: { id } })
    res.redirect('/produits')
  } catch (error) {
    res.status(400).send('Erreur : ' + error.message)
  }
}
