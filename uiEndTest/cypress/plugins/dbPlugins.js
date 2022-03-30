const { db } = require("../dbConnection");

const dbPlugin = (on, config) => {
  on(
    "task",
    {
      emptyInventory: () => db("inventory").truncate(),
      insertRecord: () => db("inventory").insert({itemName: "cheesecake", quantity: 10}),
    },
    config
  );

  return config;
};

module.exports = dbPlugin;