// models/Role.js
import { DataTypes } from 'sequelize'
import database from '../connexion.js'

const Role = database.define('Role', {
  nom: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  timestamps: false,
  freezeTableName: true
})

export default Role
