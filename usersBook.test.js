const { db } = require("./dbConnection");
afterEach(() => db("users").truncate());
describe("slite users table test", () => {
  test("insert user", async () => {
    const userData = {
      username: "Szymon Dawidowicz",
      email: "szym0nd4widowicz@gmail.com",
      passwordHash: "somepass",
    };
    const tableUser = await db("users").insert(userData);
    //knex.select('title', 'author', 'year').from('books')
    const user = await db.select('username').from('users');
    expect(user[0]).toEqual({'username': 'Szymon Dawidowicz'});
  });
});
