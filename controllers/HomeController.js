// controllers/HomeController.js
import Produit from '../models/Produit.js'
import Utilisateur from '../models/Utilisateur.js'

export const getDashboard = async (req, res) => {
  try {
    if (!req.session.user) return res.render('index', { user: null })
    const userCount = await Utilisateur.count()
    const productCount = await Produit.count()
    const produits = await Produit.findAll()
    let stockValue = 0, lowStockCount = 0
    produits.forEach(p => {
      stockValue += p.prix * p.quantite
      if (p.quantite <= 5) lowStockCount++
    })
    res.render('index', {
      nbUtilisateurs: userCount,
      nbProduits: productCount,
      valeurStock: stockValue.toFixed(2),
      alerteStock: lowStockCount
    })
  } catch (error) {
    res.status(500).send('Erreur dashboard : ' + error.message)
  }
}
