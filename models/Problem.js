// JavaScript source code
// models/problem.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Problem extends Model { }
    Problem.init({
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        templateCode: DataTypes.TEXT,
        testCases: DataTypes.JSONB,
        createdByAI: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        sequelize,
        modelName: 'Problem',
        tableName: 'Problems'
    });
    return Problem;
};
