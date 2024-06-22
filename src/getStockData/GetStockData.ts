import getAllDividends from "./GetAllDividends";
import getAllDividendsMonth from "./GetAllDividendsMonth";
import getAllPrices from "./GetAllPrices";
import getAllProfits from "./GetAllProfits";

export default async function getStockData(ticker: any) {

  const [allPrices, allDividends, allProfits, allDividendsMonth] = await Promise.all([
    getAllPrices(ticker),
    getAllDividends(ticker),
    getAllProfits(ticker),
    getAllDividendsMonth(ticker)
  ]);

  const stock = {
    ticker,
    allPrices,
    allDividends,
    allProfits,
    allDividendsMonth
  }
  return stock
}
