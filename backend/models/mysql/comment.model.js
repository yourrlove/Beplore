'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // define association here
    }
  }
  Comment.init({
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references:{
        model: 'users',
        key: 'user_id'
      }
    },
    content:{
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    parent_comment: {
        type: DataTypes.INTEGER,
        references:{
          model: 'comments',
          key: 'comment_id'
        }
    }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
  });
  return Comment;
};