const { db } = require("../dbConnection");

const dbPlugin = (on, config) => {
  console.log('db', db);
  on(
    "task",
    {
      emptyInventory: () => db("inventory").truncate(),
    },
    config
  );

  return config;
};

module.exports = dbPlugin;