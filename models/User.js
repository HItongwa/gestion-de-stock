const { DataTypes } = require('sequelize');
const connexion = require('../connexion'); // <-- CORRECTION ICI

const User = connexion.define('User', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = User;
