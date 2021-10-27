const { db } = require("./dbConnection");
const { addUser, getUser } = require("./usersBook");

afterEach(() => db("users").truncate());

describe("slite users table test", () => {
  test("insert user", async () => {
    addUser("Szymon Dawidowicz", "szym0nd4widowicz@gmail.com", "pass");

    const asd = await getUser("Szymon Dawidowicz");

    expect(asd).toEqual({ username: "Szymon Dawidowicz" });
  });
});
