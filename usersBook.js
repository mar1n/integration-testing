const { db } = require("./dbConnection");

const addUser = async (username, email, passwordHash) => {
  const tableUser = await db("users").insert({ username, email, passwordHash });
};

const getUser = async (username) => {
  const user = await db.select("username").where({ username }).from("users");
  return user[0];
};

module.exports = { addUser, getUser };
