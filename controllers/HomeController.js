import { Produit, Utilisateur, HistoriqueStock } from '../models/index.js';

export const getDashboard = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const nbProduits = await Produit.count();
    const nbUtilisateurs = await Utilisateur.count();
    
    const produitsFaibles = await Produit.findAll({
      where: {
        actif: true,
      },
    });
    const alerteStock = produitsFaibles.filter(p => p.quantite < p.quantiteMin).length;

    let valeurStock = 0;
    for (const produit of produitsFaibles) {
      valeurStock += produit.prix * produit.quantite;
    }

    const historique = await HistoriqueStock.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: Produit, attributes: ['nom'] },
        { model: Utilisateur, attributes: ['prenom', 'nom'] },
      ],
    });

    res.render('index', {
      nbProduits,
      nbUtilisateurs,
      alerteStock,
      valeurStock: valeurStock.toFixed(2),
      historique,
    });
  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).send('Erreur serveur');
  }
};
