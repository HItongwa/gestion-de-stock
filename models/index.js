import bcrypt from 'bcrypt';
import connexion from '../connexion.js';
import Role from './Role.js';
import Utilisateur from './Utilisateur.js';
import Categorie from './Categorie.js';
import Fournisseur from './Fournisseur.js';
import Produit from './Produit.js';
import HistoriqueStock from './HistoriqueStock.js';

// Associations
Utilisateur.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(Utilisateur, { foreignKey: 'roleId' });

Produit.belongsTo(Categorie, { foreignKey: 'categorieId' });
Categorie.hasMany(Produit, { foreignKey: 'categorieId' });

Produit.belongsTo(Fournisseur, { foreignKey: 'fournisseurId' });
Fournisseur.hasMany(Produit, { foreignKey: 'fournisseurId' });

HistoriqueStock.belongsTo(Produit, { foreignKey: 'produitId' });
Produit.hasMany(HistoriqueStock, { foreignKey: 'produitId' });

HistoriqueStock.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' });
Utilisateur.hasMany(HistoriqueStock, { foreignKey: 'utilisateurId' });

export {
  connexion,
  Role,
  Utilisateur,
  Categorie,
  Fournisseur,
  Produit,
  HistoriqueStock,
};

export const syncDatabase = async (syncOptions = { alter: true }) => {
  await connexion.sync(syncOptions);
};

export const seedReferenceData = async () => {
  const roleCount = await Role.count();
  if (roleCount === 0) {
    await Role.bulkCreate([{ nom: 'Admin' }, { nom: 'Utilisateur' }]);
  }

  const categoryCount = await Categorie.count();
  if (categoryCount === 0) {
    await Categorie.bulkCreate([
      { nom: 'Informatique' },
      { nom: 'Bureautique' },
    ]);
  }

  const supplierCount = await Fournisseur.count();
  if (supplierCount === 0) {
    await Fournisseur.create({
      nom: 'Fournisseur General',
      contactEmail: 'contact@test.com',
    });
  }

  const userCount = await Utilisateur.count();
  if (userCount === 0) {
    const adminRole = await Role.findOne({ where: { nom: 'Admin' } });
    if (adminRole) {
      const motDePasse = await bcrypt.hash('admin1234', 10);
      await Utilisateur.create({
        nom: 'Admin',
        prenom: 'Systeme',
        email: 'admin@gestionstock.local',
        motDePasse,
        roleId: adminRole.id,
      });
    }
  }
};

export const getDatabaseHealth = async () => {
  const [roles, categories, fournisseurs, produits, utilisateurs, historiques] =
    await Promise.all([
      Role.count(),
      Categorie.count(),
      Fournisseur.count(),
      Produit.count(),
      Utilisateur.count(),
      HistoriqueStock.count(),
    ]);

  return {
    roles,
    categories,
    fournisseurs,
    produits,
    utilisateurs,
    historiques,
  };
};
