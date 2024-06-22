interface DataDaysOperations {
  date: string;
  bestStocksByDay: { date: string; data: any[] }[] | undefined;
  balance: number;
}

export default function getTheDaysOperations(data: DataDaysOperations) {
  try {
    const { date, bestStocksByDay } = data;

    if (!bestStocksByDay) {
      throw new Error("Erro no bestStocksByDay");
    }

    for (const stocks of bestStocksByDay) {
      if (stocks.date === date) {
        return stocks.data
          .map((stock) => {
            const quantity = Math.floor(
              (data.balance * (stock.weight / 100)) / stock.price
            );

            if (quantity === 0) {
              return null;
            }

            return {
              ticker: stock.ticker,
              date: stock.date,
              price: stock.price.toString().replace(".", ","),
              quantity: quantity,
              type: "Compra",
              expenses: "0",
            };
          })
          .filter((stock) => stock !== null);
      }
    }

    return [];
  } catch (error) {
    console.error("Erro no getTheDaysOperations");
  }
}
