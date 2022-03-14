const environmentName = "development";
const db = require("knex")(require("./knexfile")[environmentName]);

const closeConnection = () => db.destroy();

module.exports = {
  db,
  closeConnection
};