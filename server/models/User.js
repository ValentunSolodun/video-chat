const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../db/db");

class Users extends Model { }
Users.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "users"
});

module.exports = {Users};

