const crypto = require("crypto");
const usersBook = new Map();

const hashPasswordBook = password => {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};

module.exports = { usersBook, hashPasswordBook };