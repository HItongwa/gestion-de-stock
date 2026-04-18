import bcrypt from 'bcrypt';
import { Utilisateur, Role } from '../models/index.js';
import { validationResult } from 'express-validator';

export const renderLogin = (req, res) => {
  res.render('login', { error: null });
};

export const loginUtilisateur = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { error: errors.array()[0].msg });
    }

    const { email, motDePasse } = req.body;

    const utilisateur = await Utilisateur.findOne({
      where: { email },
      include: { model: Role, attributes: ['nom'] },
    });

    if (!utilisateur) {
      return res.render('login', { error: 'Email ou mot de passe incorrect' });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.render('login', { error: 'Email ou mot de passe incorrect' });
    }

    if (!utilisateur.actif) {
      return res.render('login', { error: 'Ce compte est désactivé' });
    }

    req.session.user = {
      id: utilisateur.id,
      email: utilisateur.email,
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      role: utilisateur.Role.nom,
    };

    res.redirect('/');
  } catch (error) {
    console.error('Erreur login:', error);
    res.render('login', { error: 'Erreur serveur' });
  }
};

export const listUtilisateurs = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const utilisateurs = await Utilisateur.findAll({
      include: { model: Role, attributes: ['nom'] },
      order: [['createdAt', 'DESC']],
    });

    res.render('utilisateurs/list', { utilisateurs });
  } catch (error) {
    console.error('Erreur list utilisateurs:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const renderAddUtilisateur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const roles = await Role.findAll();
    res.render('utilisateurs/add', { roles, errors: [], formData: {} });
  } catch (error) {
    console.error('Erreur render add utilisateur:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const addUtilisateur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const roles = await Role.findAll();
      return res.render('utilisateurs/add', { 
        roles, 
        errors: errors.array(),
        formData: req.body,
      });
    }

    const { nom, prenom, email, motDePasse, roleId } = req.body;
    
    const utilisateurExiste = await Utilisateur.findOne({ where: { email } });
    if (utilisateurExiste) {
      const roles = await Role.findAll();
      return res.render('utilisateurs/add', { 
        roles,
        errors: [{ msg: 'Cet email est déjà utilisé' }],
        formData: req.body,
      });
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);
    
    await Utilisateur.create({
      nom,
      prenom,
      email,
      motDePasse: motDePasseHash,
      roleId,
    });

    res.redirect('/utilisateurs');
  } catch (error) {
    console.error('Erreur add utilisateur:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const renderEditUtilisateur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id);
    const roles = await Role.findAll();

    if (!utilisateur) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    res.render('utilisateurs/edit', { utilisateur, roles, errors: [] });
  } catch (error) {
    console.error('Erreur render edit utilisateur:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const editUtilisateur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const utilisateur = await Utilisateur.findByPk(id);
      const roles = await Role.findAll();
      return res.render('utilisateurs/edit', { 
        utilisateur, 
        roles,
        errors: errors.array(),
        formData: req.body,
      });
    }

    const { nom, prenom, email, motDePasse, roleId, actif } = req.body;
    const utilisateur = await Utilisateur.findByPk(id);

    if (!utilisateur) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    utilisateur.nom = nom;
    utilisateur.prenom = prenom;
    utilisateur.email = email;
    utilisateur.roleId = roleId;
    utilisateur.actif = actif === 'on' || actif === true;

    if (motDePasse) {
      utilisateur.motDePasse = await bcrypt.hash(motDePasse, 10);
    }

    await utilisateur.save();
    res.redirect('/utilisateurs');
  } catch (error) {
    console.error('Erreur edit utilisateur:', error);
    res.status(500).send('Erreur serveur');
  }
};

export const deleteUtilisateur = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id);

    if (!utilisateur) {
      return res.status(404).send('Utilisateur non trouvé');
    }

    await utilisateur.destroy();
    res.redirect('/utilisateurs');
  } catch (error) {
    console.error('Erreur delete utilisateur:', error);
    res.status(500).send('Erreur serveur');
  }
};
