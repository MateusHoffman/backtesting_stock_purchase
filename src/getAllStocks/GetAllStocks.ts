import moment from "moment";
import path from "path";
import fs from "fs/promises";
import getAllTickers from "../getAllTickers/GetAllTickers";
import getStockData from "../getStockData/GetStockData";

export interface IStockData {
  ticker: string;
  allPrices: any;
  allDividends: any;
  allProfits: any;
  allDividendsMonth: any;
}

export interface IAllStocks {
  data: IStockData[];
  updatedAt: string;
}

export async function readFile(): Promise<IAllStocks | undefined> {
  try {
    const filePath = path.resolve(__dirname, "../data/allStocks.json");
    await fs.access(filePath);
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler o arquivo allStocks.json", err);
  }
}

export async function updateFile(newData: IStockData[]): Promise<void> {
  try {
    const filePath = path.resolve(__dirname, "../data/allStocks.json");
    const allStocks: IAllStocks = {
      data: newData,
      updatedAt: moment().format("DD/MM/YYYY"),
    };
    await fs.writeFile(filePath, JSON.stringify(allStocks, null, 2), "utf8");
    console.log("Arquivo allStocks.json atualizado com sucesso.");
  } catch (err) {
    console.error("Erro ao atualizar o arquivo allStocks.json:", err);
  }
}

export default async function getAllStocks(): Promise<IStockData[] | undefined> {
  try {
    const allStocks = await readFile();
    if (allStocks?.updatedAt === moment().format("DD/MM/YYYY")) {
      return allStocks.data;
    } else {
      const allTickers = await getAllTickers();
      console.log("Total de Tickers:", allTickers.length);

      let allValidStocks = [];

      for (const [index, ticker] of allTickers.entries()) {
        console.log(
          `Falta ${allTickers.length - index} de ${allTickers.length}`
        );
        const stock = await getStockData(ticker);
        if (
          stock?.allPrices &&
          stock?.allDividends &&
          stock?.allProfits &&
          stock?.allDividendsMonth
        ) {
          allValidStocks.push(stock);
        }
      }

      updateFile(allValidStocks);
      return allValidStocks;
    }
  } catch (error) {
    throw error
  }
}
