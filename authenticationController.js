const crypto = require("crypto");
const usersBook = new Map();

const hashPasswordBook = (password) => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
};

const credentialsAreValid = (username, password) => {
  const userExists = usersBook.has(username);
  if (!userExists) return false;

  const currentPasswordHash = usersBook.get(username).passwordHash;
  return hashPasswordBook(password) === currentPasswordHash;
};

const authenticationMiddleware = async (ctx, next) => {
    try {
        const authHeader = ctx.request.headers.authorization;
        console.log("authHeader", authHeader);
        const credentials = Buffer.from(
            authHeader.slice("basic".length + 1),
            "base64"
        ).toString();
        console.log("credentials", credentials);
        const [username, password] = credentials.split(":");
        console.log("credentialsAreValid", credentialsAreValid());
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
