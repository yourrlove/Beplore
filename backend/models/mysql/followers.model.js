'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    static associate(models) {
      // define association here
    }
  }
  Follower.init({
    follower_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references:{
        model: 'users',
        key: 'user_id'
      }
    },
  }, {
    sequelize,
    modelName: 'Follower',
    tableName: 'followers',
    timestamps: true,
  });
  return Follower;
};