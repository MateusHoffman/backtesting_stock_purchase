export default function calculateTotalValueOperation(
  operationsOfTheMonth: any
) {
  // Function to parse price string to number
  const parsePrice = (priceString: any) =>
    parseFloat(priceString.replace(",", "."));

  // Calculate total value
  const totalValue = operationsOfTheMonth.reduce(
    (acc: any, transaction: any) => {
      // Convert price to number
      const price = parsePrice(transaction.price);
      // Multiply quantity by price and add to accumulator
      return acc + transaction.quantity * price;
    },
    0
  );

  return totalValue;
}
