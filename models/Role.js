import { DataTypes } from 'sequelize';
import connexion from '../connexion.js';

const Role = connexion.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: true,
  tableName: 'roles',
});

export default Role;
