import express from 'express'
import { authentification, isLogged } from '../middleware/auth.js'
import { getAllProduits, getProduitById, addProduit, updateProduit, deleteProduit, validateProduit, renderListProduits, renderAddProduit, addProduitFrontend, renderEditProduit, updateProduitFrontend, deleteProduitFrontend } from '../controllers/ProduitController.js'
const router = express.Router()
router.route('/api').get(authentification, getAllProduits).post(authentification, validateProduit, addProduit)
router.route('/api/:id').get(authentification, getProduitById).put(authentification, validateProduit, updateProduit).delete(authentification, deleteProduit)
router.get('/', isLogged, renderListProduits)
router.get('/ajouter', isLogged, renderAddProduit)
router.post('/ajouter', isLogged, addProduitFrontend)
router.get('/edit/:id', isLogged, renderEditProduit)
router.post('/edit/:id', isLogged, updateProduitFrontend)
router.get('/delete/:id', isLogged, deleteProduitFrontend)
export default router
