// models/user.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/connection');

class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true, // Set to false if email is required
            unique: true,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user', // Set a default role if needed
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'Users', // Customize the table name if needed
    }
);

module.exports = User;
