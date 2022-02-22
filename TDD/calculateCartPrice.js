const calculateCartPrice = (prices, discountPrecentage) => {
  const total = prices.reduce((sum, price) => {
      return sum + price;
  }, 0);

  return discountPrecentage
    ? ((100 - discountPrecentage) / 100) * total : total;
}
module.exports = { calculateCartPrice };
