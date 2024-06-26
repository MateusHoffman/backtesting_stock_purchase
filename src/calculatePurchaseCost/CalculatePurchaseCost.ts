type operation = {
  ticker: string;
  averagePrice: number;
  totalQuantity: number;
};

export default function calculatePurchaseCost(operations: operation[]): number {
  return operations.reduce((sum, operation) => {
    return sum + operation.averagePrice * operation.totalQuantity;
  }, 0);
}
