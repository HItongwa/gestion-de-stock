import { DataTypes } from 'sequelize';
import connexion from '../connexion.js';
import Produit from './Produit.js';
import Utilisateur from './Utilisateur.js';

const HistoriqueStock = connexion.define('HistoriqueStock', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  produitId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Produit,
      key: 'id',
    },
  },
  utilisateurId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Utilisateur,
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('entree', 'sortie', 'ajustement'),
    allowNull: false,
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  raison: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ancienneQuantite: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nouvelleQuantite: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'historique_stock',
});

HistoriqueStock.belongsTo(Produit, { foreignKey: 'produitId' });
HistoriqueStock.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' });

export default HistoriqueStock;
