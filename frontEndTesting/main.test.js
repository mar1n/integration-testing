const fs = require("fs");
const { setUncaughtExceptionCaptureCallback } = require("process");
window.document.body.innerHTML = fs.readFileSync("./index.html");

const { data, incrementCount } = require("./main");

describe("incrementCount", () => {
  test("incrementing the count", () => {
    data.cheesecakes = 0;
    incrementCount();
    expect(data.cheesecakes).toBe(1);
  });
});
