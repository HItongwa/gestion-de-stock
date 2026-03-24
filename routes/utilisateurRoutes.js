import express from 'express'
import { authentification, isLogged } from '../middleware/auth.js'
import { getAllUtilisateursAPI, getUtilisateurByIdAPI, addUtilisateurAPI, updateUtilisateurAPI, deleteUtilisateurAPI, validateUtilisateur, validateUpdate, getAllUtilisateurs, renderAddForm, addUtilisateur, renderEditForm, updateUtilisateur, deleteUtilisateur } from '../controllers/UtilisateurController.js'
const router = express.Router()
router.route('/api').get(authentification, getAllUtilisateursAPI).post(authentification, validateUtilisateur, addUtilisateurAPI)
router.route('/api/:id').get(authentification, getUtilisateurByIdAPI).put(authentification, validateUpdate, updateUtilisateurAPI).delete(authentification, deleteUtilisateurAPI)
router.get('/', isLogged, getAllUtilisateurs)
router.get('/ajouter', isLogged, renderAddForm)
router.post('/ajouter', isLogged, addUtilisateur)
router.get('/edit/:id', isLogged, renderEditForm)
router.post('/edit/:id', isLogged, updateUtilisateur)
router.get('/delete/:id', isLogged, deleteUtilisateur)
export default router
