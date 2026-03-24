// index.js — Point d'entrée principal
import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
dotenv.config()

import connexion from './connexion.js'

// Modèles
import Role from './models/Role.js'
import Utilisateur from './models/Utilisateur.js'
import Categorie from './models/Categorie.js'
import Fournisseur from './models/Fournisseur.js'
import Produit from './models/Produit.js'
import HistoriqueStock from './models/HistoriqueStock.js'

// Routes API
import authRoutes from './routes/authRoutes.js'
import categorieRoutes from './routes/categorieRoutes.js'
import fournisseurRoutes from './routes/fournisseurRoutes.js'
import historiqueStockRoutes from './routes/historiqueStockRoutes.js'

// Routes mixtes (API + Frontend)
import produitRoutes from './routes/produitRoutes.js'
import utilisateurRoutes from './routes/utilisateurRoutes.js'

// Controllers frontend
import { getDashboard } from './controllers/HomeController.js'
import { renderLogin, loginUtilisateur } from './controllers/UtilisateurController.js'

const app = express()

// -------------------------------------------------------
// Configuration moteur de vues EJS
// -------------------------------------------------------
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

// -------------------------------------------------------
// Middlewares
// -------------------------------------------------------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.JWT_SECRET || 'secret_session_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

// Rendre l'utilisateur de session disponible dans toutes les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

// -------------------------------------------------------
// Routes API REST (préfixe /api)
// -------------------------------------------------------
app.use('/api/auth', authRoutes)
app.use('/api/categories', categorieRoutes)
app.use('/api/fournisseurs', fournisseurRoutes)
app.use('/api/stock/historique', historiqueStockRoutes)
app.use('/api/produits', (req, res, next) => { req.url = '/api' + req.url; next() }, produitRoutes)
app.use('/api/utilisateurs', (req, res, next) => { req.url = '/api' + req.url; next() }, utilisateurRoutes)

// -------------------------------------------------------
// Routes Frontend EJS
// -------------------------------------------------------
app.get('/login', renderLogin)
app.post('/login', loginUtilisateur)
app.get('/logout', (req, res) => { req.session.destroy(() => res.redirect('/login')) })
app.get('/', getDashboard)
app.use('/produits', produitRoutes)
app.use('/utilisateurs', utilisateurRoutes)

// -------------------------------------------------------
// Démarrage serveur + sync BDD
// -------------------------------------------------------
const startDB = async () => {
  try {
    await connexion.authenticate()
    console.log(' Connexion à la base de données réussie !')

    await connexion.sync({ alter: true })
    console.log(' Toutes les tables sont synchronisées.')

    // Données initiales
    if (await Role.count() === 0) {
      await Role.bulkCreate([{ nom: 'Admin' }, { nom: 'Utilisateur' }])
      console.log('Rôles créés !')
    }
    if (await Categorie.count() === 0) {
      await Categorie.bulkCreate([{ nom: 'Informatique' }, { nom: 'Bureautique' }])
      console.log('Catégories créées !')
    }
    if (await Fournisseur.count() === 0) {
      await Fournisseur.create({ nom: 'Fournisseur Général', contactEmail: 'contact@test.com' })
      console.log('Fournisseur créé !')
    }

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`))
  } catch (error) {
    console.error('Erreur de démarrage :', error.message)
  }
}

startDB()
