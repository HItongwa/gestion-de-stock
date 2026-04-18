import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { HistoriqueStock, Produit, Utilisateur } from '../models/index.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, produitId } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;

    let where = {};
    if (produitId) {
      where.produitId = produitId;
    }

    const { count, rows } = await HistoriqueStock.findAndCountAll({
      where,
      include: [
        { model: Produit, attributes: ['nom'] },
        { model: Utilisateur, attributes: ['prenom', 'nom'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.render('historique/list', {
      historiques: rows,
      totalPages,
      currentPage: parseInt(page),
      produitId: produitId || null,
    });
  } catch (error) {
    console.error('Erreur list historique:', error);
    res.status(500).send('Erreur serveur');
  }
});

export default router;
