'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostLikes extends Model {
    static associate(models) {
      // define association here
    }
  }
  PostLikes.init({
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'comments',
        key: 'comment_id'
      }
    },
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'posts',
          key: 'post_id'
        }
    }
  }, {
    sequelize,
    modelName: 'PostLikes',
    tableName: 'post_likes',
    timestamps: true,
  });
  return PostLikes;
};