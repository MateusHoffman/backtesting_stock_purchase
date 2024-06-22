import moment from "moment";

export default function getDivEarning(bestStocks: any, allStocks: any) {
  const formattedArr = bestStocks.map((stock: any) => stock.data)
  const allTickers = [
    ...new Set(formattedArr.flat().map((stock: any) => stock.ticker)),
  ];
  // Filtrar allStocks para deixar apenas os objetos com tickers presentes em allTickers
  const filteredStocksByTickers = allStocks.filter((stock: any) =>
    allTickers.includes(stock.ticker)
  );

  const formatStocksByDivMonth = filteredStocksByTickers
    .map((stock: any) => {
      return stock.allDividendsMonth.map((div: any) => {
        return {
          ticker: stock.ticker,
          ...div,
        };
      });
    })
    .flat();

  // Ordenar o array usando moment.js
  const sortedDividendos = formatStocksByDivMonth.sort((a: any, b: any) => {
    return moment(a.dateCom, "DD/MM/YYYY").diff(
      moment(b.dateCom, "DD/MM/YYYY")
    );
  });

  return sortedDividendos;
}
