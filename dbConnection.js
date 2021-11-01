const enviromentName = process.env.NODE_ENV
const knex = require("knex")
const knexConfig = require("./knexfile")[enviromentName];

const db = knex(knexConfig);

const closeConnection = () => db.destroy();

module.exports = {
db,

closeConnection
};