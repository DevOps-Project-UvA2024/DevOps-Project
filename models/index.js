const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Role = require('./Role')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.Course = require('./Course')(sequelize, Sequelize);
db.File = require('./File')(sequelize, Sequelize);
db.Voting = require('./Voting')(sequelize, Sequelize);

// Associations can be defined here
db.Role.hasMany(db.User, { foreignKey: 'role_id' });
db.User.belongsTo(db.Role, { foreignKey: 'role_id' });

db.Course.hasMany(db.File, { foreignKey: 'course_id' });
db.User.hasMany(db.File, { foreignKey: 'uploader_id' });
db.File.belongsTo(db.Course, { foreignKey: 'course_id' });
db.File.belongsTo(db.User, { foreignKey: 'uploader_id' });

db.User.hasMany(db.Voting, { foreignKey: 'student_id' });
db.File.hasMany(db.Voting, { as: 'votings', foreignKey: 'file_id' });
db.Voting.belongsTo(db.User, { foreignKey: 'student_id' });
db.Voting.belongsTo(db.File, { foreignKey: 'file_id' });

module.exports = db;
