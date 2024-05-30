'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentLikes extends Model {
    static associate(models) {
      // define association here
    }
  }
  CommentLikes.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'comments',
          key: 'comment_id'
        }
    }
  }, {
    sequelize,
    modelName: 'CommentLikes',
    tableName: 'comment_likes',
    timestamps: true,
  });
  return CommentLikes;
};