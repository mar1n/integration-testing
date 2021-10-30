const crypto = require("crypto");
const { db } = require("./dbConnection");

const {
  hashPasswordBook,
  usersBook,
  credentialsAreValid,
  authenticationMiddleware,
} = require("./authenticationController");

beforeEach(() => db("users").truncate());

describe("hashPassword", () => {
  test("hashing password", () => {
    const plainTextPassword = "password_example";
    const hash = crypto.createHash("sha256");

    hash.update(plainTextPassword);
    const expectedHash = hash.digest("hex");
    const actualHash = hashPasswordBook(plainTextPassword);
    expect(actualHash).toBe(expectedHash);
  });
});

describe("credentialsAreValid", () => {
  test("validating credentials", async () => {
    await db("users").insert({
      username: "test_user",
      email: "test_user@example.org",
      passwordHash: hashPasswordBook("a_password"),
    });

    expect(await credentialsAreValid("test_user", "a_password")).toBe(true);
  });
});

describe("authenticationMiddleware", () => {
  test("returning an error if the credentials are not valid", async () => {
    const fakeAuth = Buffer.from("invalid:credentials").toString("base64");

    const ctx = {
      request: {
        headers: { authorization: `Basic ${fakeAuth}` },
      },
    };
    const next = jest.fn();
    await authenticationMiddleware(ctx, next);
    expect(next.mock.calls).toHaveLength(0);
    expect(ctx).toEqual({
      ...ctx,
      status: 401,
      body: { message: "please provide valid credentials" },
    });
  });
  test("check if next callback was invoked", async () => {
    await db("users").insert({
      username: "test_user",
      email: "test_user@example.org",
      passwordHash: hashPasswordBook("a_password"),
    });
    const fakeAuth = Buffer.from("test_user:a_password").toString("base64");

    const ctx = {
      request: {
        headers: { authorization: `Basic ${fakeAuth}` },
      },
    };
    const next = jest.fn();
    await authenticationMiddleware(ctx, next);
    expect(next.mock.calls).toHaveLength(1);
  });
});
