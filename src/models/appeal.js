import { DataTypes } from 'sequelize';

export const defineAppeal = (sequelize) => {
  return sequelize.define('Appeal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Новое', 'В работе', 'Завершено', 'Отменено'),
      defaultValue: 'Новое',
    }, // Не стал использовать дополнительную таблицу, так как вряд ли эти данные будут часто меняться, нет смысла делать доп таблицу
    resolution: {
      type: DataTypes.TEXT,
    },
    cancelReason: {
      type: DataTypes.TEXT,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
  });
};
