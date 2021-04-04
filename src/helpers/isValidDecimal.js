module.exports = (num) => {
  const decimal = `${num}`.split('.')[1];
  return !decimal || decimal.length <= 2;
};
