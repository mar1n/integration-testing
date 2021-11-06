const fs = require("fs");

const init = filepath => {
  const getState = () => {
    return parseInt(fs.readFileSync(filepath, "utf-8"), 10);
  };
  const setState = n => fs.writeFileSync(filepath, JSON.stringify(n));
  const increment = () => fs.writeFileSync(filepath, JSON.stringify(getState() + 1));
  const decrement = () => fs.writeFileSync(filepath, JSON.stringify(getState() - 1));

  return { getState, setState, increment, decrement };
};

module.exports = { init };