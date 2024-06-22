export default function calculateStockPosition(operations: any) {
  // Usamos reduce para calcular diretamente os totais por ticker
  const tickerData = operations.reduce((acc: any, operation: any) => {
    const { ticker, price, quantity } = operation;
    const numericPrice = parseFloat(price.replace(",", "."));

    // Inicializa o objeto para o ticker se ainda não existir
    acc[ticker] = acc[ticker] || { totalQuantity: 0, weightedTotal: 0 };

    // Atualiza os totais
    acc[ticker].totalQuantity += quantity;
    acc[ticker].weightedTotal += numericPrice * quantity;

    return acc;
  }, {});

  // Agora construímos o array de objetos com ticker, preço médio e quantidade
  const result = Object.keys(tickerData).map((ticker) => {
    const { totalQuantity, weightedTotal } = tickerData[ticker];
    const averagePrice = weightedTotal / totalQuantity;

    return {
      ticker,
      averagePrice: parseFloat(averagePrice.toFixed(2)), // Arredonda para 2 casas decimais
      totalQuantity,
    };
  });

  return result;
}
