module.exports = {
  snapshotSerializers: ["jest-emotion"],
  setupFilesAfterEnv: [
    "<rootDir>/setupJestDom.js",
    "<rootDir>/setupGlobalFetch.js",
    "<rootDir>/setupJestEmotion.js"
  ],
};
