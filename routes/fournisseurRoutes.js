import express from 'express'
import { authentification } from '../middleware/auth.js'
import { getAllFournisseurs, getFournisseurById, addFournisseur, updateFournisseur, deleteFournisseur, validateFournisseur } from '../controllers/FournisseurController.js'
const router = express.Router()
router.route('/').get(authentification, getAllFournisseurs).post(authentification, validateFournisseur, addFournisseur)
router.route('/:id').get(authentification, getFournisseurById).put(authentification, validateFournisseur, updateFournisseur).delete(authentification, deleteFournisseur)
export default router
