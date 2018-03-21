// Small tools
exports.getTimestamp = () => Date.now();

exports.getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
