const crypto = require("crypto");
const {
  hashPasswordBook,
  usersBook,
  credentialsAreValid,
  authenticationMiddleware
} = require("./authenticationController");

afterEach(() => usersBook.clear());

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
  test("validating credentials", () => {
    usersBook.set("test_user", {
      email: "test_user@example.org",
      passwordHash: hashPasswordBook("a_password"),
    });
    const hasValidCredentials = credentialsAreValid(
      "test_user",

      "a_password"
    );
    expect(hasValidCredentials).toBe(true);
  });

  describe("authenticationMiddleware", () => {
    test("returning an error if the credentials are not valid", async () => {
      const fakeAuth = Buffer.from("invalid:credentials")
        .toString("base64");
        console.log("fakeAuth", fakeAuth);
      const ctx = {
        request: {
          headers: { authorization: `Basic ${fakeAuth}` }
        }
      }
      const next = jest.fn();
      await authenticationMiddleware(ctx, next);
      expect(next.mock.calls).toHaveLength(0);
      expect(ctx).toEqual({
        ...ctx,
        status: 401,
        body: { message: "please provide valid credentials" }
      })
    })
    test("check if next callback was invoked", async () => {
      usersBook.set("invalid", { email: "test_user@example.org", passwordHash: hashPasswordBook("credentials") });
      const fakeAuth = Buffer.from("invalid:credentials")
        .toString("base64");
        console.log("fakeAuth", fakeAuth);
      const ctx = {
        request: {
          headers: { authorization: `Basic ${fakeAuth}` }
        }
      }
      const next = jest.fn();
      await authenticationMiddleware(ctx, next);
      expect(next.mock.calls).toHaveLength(1);
    })
  });
});
