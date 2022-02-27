const calculateCartPrice = (prices, discountPrecentage) => {
  const total = prices.reduce((sum, price) => {
      return sum + price;
  }, 0);

  return typeof discountPrecentage === "number"
    && !isNaN(discountPrecentage)
        ? ((100 - discountPrecentage) / 100) * total
        : total;
}
module.exports = { calculateCartPrice };
