// models/Utilisateur.js
import { DataTypes } from 'sequelize'
import database from '../connexion.js'
import Role from './Role.js'

const Utilisateur = database.define('Utilisateur', {
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  motDePasse: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
})

// Relation N-à-1 : Un utilisateur appartient à un seul rôle
Utilisateur.belongsTo(Role, {
  foreignKey: 'roleId',
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT'
})

export default Utilisateur
