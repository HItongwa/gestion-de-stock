import { Produit, Categorie, Fournisseur, HistoriqueStock, Utilisateur } from '../models/index.js';
import { validationResult } from 'express-validator';

export const listProduits = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const produits = await Produit.findAll({
      include: [
        { model: Categorie, attributes: ['nom'] },
        { model: Fournisseur, attributes: ['nom'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.render('produits/list', { produits });
  } catch (error) {
    console.error('Erreur list produits:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const renderAddProduit = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const categories = await Categorie.findAll();
    const fournisseurs = await Fournisseur.findAll();
    
    res.render('produits/add', { categories, fournisseurs, errors: [], formData: {} });
  } catch (error) {
    console.error('Erreur render add produit:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const addProduit = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await Categorie.findAll();
      const fournisseurs = await Fournisseur.findAll();
      return res.render('produits/add', { 
        categories, 
        fournisseurs,
        errors: errors.array(),
        formData: req.body,
      });
    }

    const { nom, description, categorieId, fournisseurId, prix, quantite, quantiteMin, sku } = req.body;

    const skuExiste = await Produit.findOne({ where: { sku } });
    if (skuExiste) {
      const categories = await Categorie.findAll();
      const fournisseurs = await Fournisseur.findAll();
      return res.render('produits/add', { 
        categories,
        fournisseurs,
        errors: [{ msg: 'Ce SKU est déjà utilisé' }],
        formData: req.body,
      });
    }

    const produit = await Produit.create({
      nom,
      description,
      categorieId: parseInt(categorieId),
      fournisseurId: parseInt(fournisseurId),
      prix: parseFloat(prix),
      quantite: parseInt(quantite),
      quantiteMin: parseInt(quantiteMin) || 5,
      sku,
    });

    // Enregistrer dans l'historique
    await HistoriqueStock.create({
      produitId: produit.id,
      utilisateurId: req.session.user.id,
      type: 'entree',
      quantite: parseInt(quantite),
      raison: 'Création du produit',
      ancienneQuantite: 0,
      nouvelleQuantite: parseInt(quantite),
    });

    res.redirect('/produits');
  } catch (error) {
    console.error('Erreur add produit:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const renderEditProduit = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const produit = await Produit.findByPk(id, {
      include: [
        { model: Categorie, attributes: ['nom'] },
        { model: Fournisseur, attributes: ['nom'] },
      ],
    });
    const categories = await Categorie.findAll();
    const fournisseurs = await Fournisseur.findAll();

    if (!produit) {
      return res.status(404).send('Produit non trouvé');
    }

    res.render('produits/edit', { produit, categories, fournisseurs, errors: [] });
  } catch (error) {
    console.error('Erreur render edit produit:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const editProduit = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const produit = await Produit.findByPk(id);
      const categories = await Categorie.findAll();
      const fournisseurs = await Fournisseur.findAll();
      return res.render('produits/edit', { 
        produit, 
        categories,
        fournisseurs,
        errors: errors.array(),
        formData: req.body,
      });
    }

    const { nom, description, categorieId, fournisseurId, prix, quantite, quantiteMin, actif } = req.body;
    const produit = await Produit.findByPk(id);

    if (!produit) {
      return res.status(404).send('Produit non trouvé');
    }

    const ancienneQuantite = produit.quantite;
    const nouvelleQuantite = parseInt(quantite);
    const differenceQuantite = nouvelleQuantite - ancienneQuantite;

    produit.nom = nom;
    produit.description = description;
    produit.categorieId = parseInt(categorieId);
    produit.fournisseurId = parseInt(fournisseurId);
    produit.prix = parseFloat(prix);
    produit.quantite = nouvelleQuantite;
    produit.quantiteMin = parseInt(quantiteMin) || 5;
    produit.actif = actif === 'on' || actif === true;

    await produit.save();

    if (differenceQuantite !== 0) {
      await HistoriqueStock.create({
        produitId: produit.id,
        utilisateurId: req.session.user.id,
        type: differenceQuantite > 0 ? 'entree' : 'sortie',
        quantite: Math.abs(differenceQuantite),
        raison: 'Ajustement lors de modification',
        ancienneQuantite,
        nouvelleQuantite,
      });
    }

    res.redirect('/produits');
  } catch (error) {
    console.error('Erreur edit produit:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const deleteProduit = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const produit = await Produit.findByPk(id);

    if (!produit) {
      return res.status(404).send('Produit non trouvé');
    }

    await produit.destroy();
    res.redirect('/produits');
  } catch (error) {
    console.error('Erreur delete produit:', error);
    res.status(500).send('Erreur serveur');
  }
};
