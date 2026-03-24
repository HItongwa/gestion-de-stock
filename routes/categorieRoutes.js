import express from 'express'
import { authentification } from '../middleware/auth.js'
import { getAllCategories, getCategorieById, addCategorie, updateCategorie, deleteCategorie, validateCategorie } from '../controllers/CategorieController.js'
const router = express.Router()
router.route('/').get(authentification, getAllCategories).post(authentification, validateCategorie, addCategorie)
router.route('/:id').get(authentification, getCategorieById).put(authentification, validateCategorie, updateCategorie).delete(authentification, deleteCategorie)
export default router
