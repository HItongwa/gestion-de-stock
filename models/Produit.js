import { DataTypes } from 'sequelize';
import connexion from '../connexion.js';
import Categorie from './Categorie.js';
import Fournisseur from './Fournisseur.js';

const Produit = connexion.define('Produit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categorieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categorie,
      key: 'id',
    },
  },
  fournisseurId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Fournisseur,
      key: 'id',
    },
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  quantite: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  quantiteMin: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  sku: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  tableName: 'produits',
});

Produit.belongsTo(Categorie, { foreignKey: 'categorieId' });
Produit.belongsTo(Fournisseur, { foreignKey: 'fournisseurId' });

export default Produit;
