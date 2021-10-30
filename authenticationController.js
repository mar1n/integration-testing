const crypto = require("crypto");
const usersBook = new Map();

const { db } = require("./dbConnection");

const hashPasswordBook = (password) => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
};

const credentialsAreValid = async (username, password) => {
    const user = await db
      .select()
      .from("users")
      .where({ username })
      .first();
    if (!user) return false;
    return hashPasswordBook(password) === user.passwordHash;
  };

const authenticationMiddleware = async (ctx, next) => {
    try {
        const authHeader = ctx.request.headers.authorization;
        
        const credentials = Buffer.from(
            authHeader.slice("basic".length + 1),
            "base64"
        ).toString();
        
        const [username, password] = credentials.split(":");
        if(!credentialsAreValid(username, password)) {
            throw new Error("invalid credentials");
        }
    } catch (e) {
        ctx.status = 401;
        ctx.body = { message: "please provide valid credentials" };
        return;
    }
    await next();
}

module.exports = { usersBook, hashPasswordBook, credentialsAreValid, authenticationMiddleware };
