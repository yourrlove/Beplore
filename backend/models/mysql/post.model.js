'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // define association here
    }
  }
  Post.init({
    post_id: {
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
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
  });
  return Post;
};