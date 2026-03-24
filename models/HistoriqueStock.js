// models/HistoriqueStock.js
import { DataTypes } from 'sequelize'
import database from '../connexion.js'
import Produit from './Produit.js'
import Utilisateur from './Utilisateur.js'

const HistoriqueStock = database.define('HistoriqueStock', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  quantiteChangee: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
})

// Relation N-à-1 : Un historique est lié à un produit
HistoriqueStock.belongsTo(Produit, {
  foreignKey: 'produitId',
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT'
})

// Relation N-à-1 : Un historique est lié à un utilisateur
HistoriqueStock.belongsTo(Utilisateur, {
  foreignKey: 'utilisateurId',
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT'
})

export default HistoriqueStock
