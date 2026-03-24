// controllers/UtilisateurController.js
import Utilisateur from '../models/Utilisateur.js'
import Role from '../models/Role.js'
import bcrypt from 'bcrypt'
import { body, validationResult } from 'express-validator'

export const validateUtilisateur = [
  body('nom').notEmpty().withMessage('Le nom est requis.').isLength({ min: 2, max: 100 }).trim(),
  body('prenom').optional({ checkFalsy: true }).isLength({ max: 100 }).trim(),
  body('email').notEmpty().withMessage('L\'email est requis.').isEmail().withMessage('Format d\'email invalide.').normalizeEmail(),
  body('motDePasse').notEmpty().withMessage('Le mot de passe est requis.').isLength({ min: 6 }).withMessage('Minimum 6 caractères.'),
  body('roleId').notEmpty().withMessage('Le rôle est requis.').isInt({ min: 1 }).withMessage('roleId invalide.')
]

export const validateUpdate = [
  body('nom').notEmpty().withMessage('Le nom est requis.').isLength({ min: 2, max: 100 }).trim(),
  body('prenom').optional({ checkFalsy: true }).isLength({ max: 100 }).trim(),
  body('email').notEmpty().withMessage('L\'email est requis.').isEmail().withMessage('Format d\'email invalide.').normalizeEmail(),
  body('motDePasse').optional({ checkFalsy: true }).isLength({ min: 6 }).withMessage('Minimum 6 caractères si fourni.'),
  body('roleId').notEmpty().withMessage('Le rôle est requis.').isInt({ min: 1 }).withMessage('roleId invalide.')
]

// ---- API REST ----
export const getAllUtilisateursAPI = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    const { count, rows } = await Utilisateur.findAndCountAll({
      attributes: { exclude: ['motDePasse'] },
      include: [Role],
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

export const getUtilisateurByIdAPI = async (req, res) => {
  const { id } = req.params
  try {
    const result = await Utilisateur.findByPk(id, {
      attributes: { exclude: ['motDePasse'] },
      include: [Role]
    })
    if (!result) return res.status(404).json({ message: 'Utilisateur non trouvé.' })
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addUtilisateurAPI = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.motDePasse, salt)
    const result = await Utilisateur.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      motDePasse: hashedPassword,
      roleId: req.body.roleId
    })
    const { motDePasse, ...userData } = result.toJSON()
    res.status(201).json({ data: userData, message: 'Utilisateur créé avec succès.' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateUtilisateurAPI = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { id } = req.params
  let updatedData = { nom: req.body.nom, prenom: req.body.prenom, email: req.body.email, roleId: req.body.roleId }
  if (req.body.motDePasse) {
    const salt = await bcrypt.genSalt(10)
    updatedData.motDePasse = await bcrypt.hash(req.body.motDePasse, salt)
  }
  try {
    const [updatedRows] = await Utilisateur.update(updatedData, { where: { id } })
    if (updatedRows === 0) return res.status(404).json({ message: `Utilisateur ${id} non trouvé.` })
    res.status(200).json({ message: `Utilisateur ${id} mis à jour avec succès.` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteUtilisateurAPI = async (req, res) => {
  const { id } = req.params
  try {
    const deletedRows = await Utilisateur.destroy({ where: { id } })
    if (deletedRows === 0) return res.status(404).json({ message: `Utilisateur ${id} non trouvé.` })
    res.status(200).json({ message: `Utilisateur ${id} supprimé avec succès.` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// ---- FRONTEND (EJS) ----
export const getAllUtilisateurs = async (req, res) => {
  try {
    const result = await Utilisateur.findAll({ attributes: { exclude: ['motDePasse'] }, include: [Role] })
    res.render('utilisateurs/list', { users: result })
  } catch (error) {
    res.status(500).send('Erreur : ' + error.message)
  }
}

export const renderAddForm = async (req, res) => {
  try {
    const roles = await Role.findAll()
    res.render('utilisateurs/add', { roles })
  } catch (error) {
    res.status(500).send('Erreur : ' + error.message)
  }
}

export const addUtilisateur = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.motDePasse, salt)
    await Utilisateur.create({ nom: req.body.nom, prenom: req.body.prenom, email: req.body.email, motDePasse: hashedPassword, roleId: req.body.roleId })
    res.redirect('/utilisateurs')
  } catch (error) {
    res.status(400).send('Erreur : ' + error.message)
  }
}

export const renderEditForm = async (req, res) => {
  const { id } = req.params
  try {
    const user = await Utilisateur.findByPk(id, { attributes: { exclude: ['motDePasse'] } })
    const roles = await Role.findAll()
    if (!user) return res.status(404).send('Utilisateur non trouvé')
    res.render('utilisateurs/edit', { user, roles })
  } catch (error) {
    res.status(500).send('Erreur : ' + error.message)
  }
}

export const updateUtilisateur = async (req, res) => {
  const { id } = req.params
  let updatedData = { nom: req.body.nom, prenom: req.body.prenom, email: req.body.email, roleId: req.body.roleId }
  if (req.body.motDePasse) {
    const salt = await bcrypt.genSalt(10)
    updatedData.motDePasse = await bcrypt.hash(req.body.motDePasse, salt)
  }
  try {
    await Utilisateur.update(updatedData, { where: { id } })
    res.redirect('/utilisateurs')
  } catch (error) {
    res.status(400).send('Erreur : ' + error.message)
  }
}

export const deleteUtilisateur = async (req, res) => {
  const { id } = req.params
  try {
    await Utilisateur.destroy({ where: { id } })
    res.redirect('/utilisateurs')
  } catch (error) {
    res.status(400).send('Erreur : ' + error.message)
  }
}

// ---- AUTH SESSION ----
export const renderLogin = (req, res) => { res.render('login') }

export const loginUtilisateur = async (req, res) => {
  const { email, motDePasse } = req.body
  try {
    const utilisateur = await Utilisateur.findOne({ where: { email } })
    if (!utilisateur) return res.render('login', { error: 'Email introuvable.' })
    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse)
    if (!isMatch) return res.render('login', { error: 'Mot de passe incorrect.' })
    req.session.user = { id: utilisateur.id, email: utilisateur.email, nom: utilisateur.nom, prenom: utilisateur.prenom, roleId: utilisateur.roleId }
    res.redirect('/')
  } catch (error) {
    res.render('login', { error: 'Erreur technique : ' + error.message })
  }
}
