import express from 'express'
import { authentification } from '../middleware/auth.js'
import { getAllHistorique, addMouvementStock, getHistoriqueByProduit, validateMouvement } from '../controllers/HistoriqueStockController.js'
const router = express.Router()
router.route('/').get(authentification, getAllHistorique).post(authentification, validateMouvement, addMouvementStock)
router.route('/produit/:idProduit').get(authentification, getHistoriqueByProduit)
export default router
