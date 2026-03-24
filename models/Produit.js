// models/Produit.js
import { DataTypes } from 'sequelize'
import database from '../connexion.js'
import Categorie from './Categorie.js'
import Fournisseur from './Fournisseur.js'

const Produit = database.define('Produit', {
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  prix: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
})

// Relation N-à-1 : Un produit appartient à une catégorie
Produit.belongsTo(Categorie, {
  foreignKey: 'categorieId',
  onDelete: 'RESTRICT', // Empêche la suppression d'une catégorie liée à des produits
  onUpdate: 'RESTRICT'
})

// Relation N-à-1 : Un produit appartient à un fournisseur
Produit.belongsTo(Fournisseur, {
  foreignKey: 'fournisseurId',
  onDelete: 'RESTRICT', // Empêche la suppression d'un fournisseur lié à des produits
  onUpdate: 'RESTRICT'
})

export default Produit
