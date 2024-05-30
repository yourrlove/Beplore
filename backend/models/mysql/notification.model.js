'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    source_user_id: {
      type: DataTypes.INTEGER,
      references:{
        model: 'users',
        key: 'user_id'
      }
    },
    target_post_id: {
        type: DataTypes.INTEGER,
        references:{
          model: 'posts',
          key: 'post_id'
        },
        allowNull: true
    },
    target_comment_id: {
        type: DataTypes.INTEGER,
        references:{
          model: 'comments',
          key: 'comment_id'
        },
        allowNull: true
    },
    content:{
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
  });
  return Notification;
};