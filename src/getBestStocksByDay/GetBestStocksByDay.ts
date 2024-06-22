import moment from "moment";
import { DateStringArray } from "../generateDateRangeArray/GenerateDateRangeArray";
import getAllStocks from "../getAllStocks/GetAllStocks";

interface BestStocksOfTheDay {
  date: string;
  data: any[];
}

function getCurrentPrice(stock: any, date: any) {
  const prices = stock?.allPrices;
  const foundItem = prices.find((item: any) => {
    return date === item.date;
  });
  return foundItem ? foundItem.price : null;
}

function getDividendHistoryLast10Years(stock: any, date: any) {
  const allDividends = stock.allDividends;
  const currentYear = moment(date, "DD/MM/YYYY").year();
  const yearArray = Array.from({ length: 10 }, (_, i) => currentYear - i - 1);
  const containsAllYears = yearArray.every((year) =>
    allDividends.some((obj: any) => obj.year === year)
  );
  if (containsAllYears) {
    const isIncluded = (year: any, array: any) => array.includes(year);
    const filteredDividendHistory = allDividends.filter(({ year }: any) =>
      isIncluded(year, yearArray)
    );
    return filteredDividendHistory;
  } else {
    return null;
  }
}

function getProfitHistoryLast10Years(stock: any, date: any) {
  const allProfits = stock.allProfits;
  const currentYear = moment(date, "DD/MM/YYYY").year();
  const yearArray = Array.from({ length: 10 }, (_, i) => currentYear - i - 1);
  const containsAllYears = yearArray.every((year) =>
    allProfits.some((obj: any) => +obj.year === +year)
  );
  if (containsAllYears) {
    const isIncluded = (year: any, array: any) => array.includes(year);
    const filteredProfitByYear = allProfits.filter(({ year }: any) =>
      isIncluded(+year, yearArray)
    );
    return filteredProfitByYear;
  } else {
    return null;
  }
}

function filterByPrefix(stocks: any) {
  return stocks.reduce((acc: any, stock: any) => {
    const prefix = stock.ticker.match(/[A-Z]+/)[0];
    const existingStock = acc.find((s: any) => s.ticker.startsWith(prefix));
    if (!existingStock) {
      acc.push(stock);
    } else if (parseFloat(stock.DY) > parseFloat(existingStock.DY)) {
      acc = acc.filter((s: any) => s.ticker !== existingStock.ticker);
      acc.push(stock);
    }
    return acc;
  }, []);
}

function calculateWeight(stocks: any) {
  const totalDY = stocks.reduce((sum: any, stock: any) => sum + stock.DY, 0);

  return stocks.map((stock: any) => {
    const weight = ((stock.DY / totalDY) * 100).toFixed(2);
    return {
      ...stock,
      weight: parseFloat(weight),
    };
  });
}

function getDividendYieldMin(dividendLast10Years: any, currentPrice: any) {
  const sortDividendValue = dividendLast10Years.sort(
    (a: any, b: any) => a.value - b.value
  );
  const thirdLowestValue = sortDividendValue[2];
  const DY = (thirdLowestValue.value / currentPrice) * 100;
  return DY;
}

function getBestStocksOfTheDay(stocks: any[], date: string) {
  try {
    const minAcceptableAnnualNetProfit =
      process.env.MIN_ACCEPTABLE_ANNUAL_NET_PROFIT;
    const minAcceptableAnnualDividends =
      process.env.MIN_ACCEPTABLE_ANNUAL_DIVIDENDS;
    if (!minAcceptableAnnualNetProfit || !minAcceptableAnnualDividends) {
      throw new Error("Erro ao pegar o ENV");
    }
    // Formata os dados exibindo apenas os registros do início até a data especificada.
    const formattedStocks = stocks.map((stock) => {
      const currentPrice = getCurrentPrice(stock, date);
      const dividendLast10Years = getDividendHistoryLast10Years(stock, date);
      const profitLast10Years = getProfitHistoryLast10Years(stock, date);

      return {
        ticker: stock.ticker,
        date: date,
        currentPrice,
        dividendLast10Years,
        profitLast10Years,
      };
    });
    // Filtrar as ações que possui dados como null após a formatação
    const filteredByDataNull = formattedStocks.filter((stock) => {
      return (
        stock.currentPrice !== null &&
        stock.dividendLast10Years !== null &&
        stock.profitLast10Years !== null
      );
    });
    // // Filtrar as ações que possui 80% do lucro liquido >= 500 milhões
    const filteredByProfit = filteredByDataNull.filter((stock) => {
      const sort = stock.profitLast10Years.sort(
        (a: any, b: any) => a.profit - b.profit
      );
      return sort[1].profit >= +minAcceptableAnnualNetProfit;
    });
    // Filtrar as ações que possui os dois menores dividendos nos últimos 2 anos
    const filteredByDiv = filteredByProfit.filter((stock) => {
      const topTwoYears = stock.dividendLast10Years
        .sort((a: any, b: any) => b.year - a.year)
        .slice(0, 2);
      const lowestTwoValues = stock.dividendLast10Years
        .sort((a: any, b: any) => a.value - b.value)
        .slice(0, 2);
      const areArraysIdentical =
        topTwoYears.length === lowestTwoValues.length &&
        topTwoYears.every(
          (obj: any, index: any) =>
            obj.year === lowestTwoValues[index].year &&
            obj.value === lowestTwoValues[index].value
        );
      return !areArraysIdentical;
    });
    // Formata os dados encontrar o dividend yield mínimo
    const formattedStocksDy = filteredByDiv.map((stock) => {
      const dividendYieldMin = getDividendYieldMin(
        stock.dividendLast10Years,
        stock.currentPrice
      );
      return {
        ticker: stock.ticker,
        date: stock.date,
        price: stock.currentPrice,
        DY: parseFloat(dividendYieldMin.toFixed(2)),
      };
    });
    // Filtrar as ações que possui dy >= 6
    const filteredByDy = formattedStocksDy.filter((stock) => {
      return stock.DY >= +minAcceptableAnnualDividends;
    });
    const sortDescByDy = filteredByDy.sort((a, b) => b.DY - a.DY);
    const filteredByPrefix = filterByPrefix(sortDescByDy);
    const formattedStockByWeight = calculateWeight(filteredByPrefix);
    return formattedStockByWeight;
  } catch (error) {
    console.error("Erro ao obter as melhores ações do dia", error);
  }
}

export default async function getBestStocksByDay(
  dateRangeArray: DateStringArray,
  allStocks: any
) {
  try {
    console.log('Pegando a lista das melhores ações por dia');

    let bestStocksOfTheDay: BestStocksOfTheDay[] = [];

    for (const date of dateRangeArray) {
      const bestStocksOfTheDayData = getBestStocksOfTheDay(allStocks, date);
      bestStocksOfTheDay.push({ date, data: bestStocksOfTheDayData });
    }
    const filterDataWithContent = bestStocksOfTheDay.filter((obj: any) => obj.data.length);

    return filterDataWithContent
  } catch (error) {
    console.error("Erro ao pegar as melhores ações por dia");
  }
}
