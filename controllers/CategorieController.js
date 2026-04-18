import { Categorie, Produit } from '../models/index.js';
import { validationResult } from 'express-validator';

export const listCategories = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const categories = await Categorie.findAll({
      include: [{ model: Produit, attributes: ['id'] }],
      order: [['createdAt', 'DESC']],
    });

    res.render('categories/list', { categories });
  } catch (error) {
    console.error('Erreur list categories:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const renderAddCategorie = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    res.render('categories/add', { errors: [], formData: {} });
  } catch (error) {
    console.error('Erreur render add categorie:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const addCategorie = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('categories/add', { 
        errors: errors.array(),
        formData: req.body,
      });
    }

    const { nom, description } = req.body;

    const categorieExiste = await Categorie.findOne({ where: { nom } });
    if (categorieExiste) {
      return res.render('categories/add', { 
        errors: [{ msg: 'Cette catégorie existe déjà' }],
        formData: req.body,
      });
    }

    await Categorie.create({ nom, description });
    res.redirect('/categories');
  } catch (error) {
    console.error('Erreur add categorie:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const renderEditCategorie = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).send('Catégorie non trouvée');
    }

    res.render('categories/edit', { categorie, errors: [] });
  } catch (error) {
    console.error('Erreur render edit categorie:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const editCategorie = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categorie = await Categorie.findByPk(id);
      return res.render('categories/edit', { 
        categorie,
        errors: errors.array(),
        formData: req.body,
      });
    }

    const { nom, description } = req.body;
    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).send('Catégorie non trouvée');
    }

    categorie.nom = nom;
    categorie.description = description;
    await categorie.save();

    res.redirect('/categories');
  } catch (error) {
    console.error('Erreur edit categorie:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const deleteCategorie = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const categorie = await Categorie.findByPk(id);

    if (!categorie) {
      return res.status(404).send('Catégorie non trouvée');
    }

    const produitCount = await Produit.count({ where: { categorieId: id } });
    if (produitCount > 0) {
      return res.status(400).send('Impossible de supprimer une catégorie avec des produits');
    }

    await categorie.destroy();
    res.redirect('/categories');
  } catch (error) {
    console.error('Erreur delete categorie:', error);
    res.status(500).send('Erreur serveur');
  }
};
