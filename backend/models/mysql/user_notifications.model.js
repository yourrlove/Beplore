'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserNotification extends Model {
    static associate(models) {
      // define association here
    }
  }
  UserNotification.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'notifications',
          key: 'notification_id'
        }
    }
  }, {
    sequelize,
    modelName: 'UserNotification',
    tableName: 'user_notifications',
    timestamps: true,
  });
  return UserNotification;
};