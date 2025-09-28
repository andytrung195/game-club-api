const { sequelize } = require('../config/sequelize');
const Club = require('./Club');
const Event = require('./Event');

// Define associations
Club.hasMany(Event, {
  foreignKey: 'club_id',
  as: 'events',
  onDelete: 'CASCADE',
});

Event.belongsTo(Club, {
  foreignKey: 'club_id',
  as: 'club',
});

module.exports = {
  sequelize,
  Club,
  Event,
};
