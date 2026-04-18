import { Fournisseur, Produit } from '../models/index.js';
import { validationResult } from 'express-validator';

export const listFournisseurs = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const fournisseurs = await Fournisseur.findAll({
      include: [{ model: Produit, attributes: ['id'] }],
      order: [['createdAt', 'DESC']],
    });

    res.render('fournisseurs/list', { fournisseurs });
  } catch (error) {
    console.error('Erreur list fournisseurs:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const renderAddFournisseur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    res.render('fournisseurs/add', { errors: [], formData: {} });
  } catch (error) {
    console.error('Erreur render add fournisseur:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const addFournisseur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('fournisseurs/add', { 
        errors: errors.array(),
        formData: req.body,
      });
    }

    const { nom, contactEmail, telephone, adresse } = req.body;

    const fournisseurExiste = await Fournisseur.findOne({ where: { nom } });
    if (fournisseurExiste) {
      return res.render('fournisseurs/add', { 
        errors: [{ msg: 'Ce fournisseur existe déjà' }],
        formData: req.body,
      });
    }

    await Fournisseur.create({
      nom,
      contactEmail,
      telephone,
      adresse,
    });

    res.redirect('/fournisseurs');
  } catch (error) {
    console.error('Erreur add fournisseur:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const renderEditFournisseur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const fournisseur = await Fournisseur.findByPk(id);

    if (!fournisseur) {
      return res.status(404).send('Fournisseur non trouvé');
    }

    res.render('fournisseurs/edit', { fournisseur, errors: [] });
  } catch (error) {
    console.error('Erreur render edit fournisseur:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const editFournisseur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const fournisseur = await Fournisseur.findByPk(id);
      return res.render('fournisseurs/edit', { 
        fournisseur,
        errors: errors.array(),
        formData: req.body,
      });
    }

    const { nom, contactEmail, telephone, adresse } = req.body;
    const fournisseur = await Fournisseur.findByPk(id);

    if (!fournisseur) {
      return res.status(404).send('Fournisseur non trouvé');
    }

    fournisseur.nom = nom;
    fournisseur.contactEmail = contactEmail;
    fournisseur.telephone = telephone;
    fournisseur.adresse = adresse;
    await fournisseur.save();

    res.redirect('/fournisseurs');
  } catch (error) {
    console.error('Erreur edit fournisseur:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const deleteFournisseur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const fournisseur = await Fournisseur.findByPk(id);

    if (!fournisseur) {
      return res.status(404).send('Fournisseur non trouvé');
    }

    const produitCount = await Produit.count({ where: { fournisseurId: id } });
    if (produitCount > 0) {
      return res.status(400).send('Impossible de supprimer un fournisseur avec des produits');
    }

    await fournisseur.destroy();
    res.redirect('/fournisseurs');
  } catch (error) {
    console.error('Erreur delete fournisseur:', error);
    res.status(500).send('Erreur serveur');
  }
};
