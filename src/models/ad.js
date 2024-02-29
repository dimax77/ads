// models/ad.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/connection');

class Ad extends Model { }

Ad.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add more fields as needed
},
  {
    sequelize,
    modelName: 'Ad',
    tableName: 'Ads'
  }
);

module.exports = Ad;
