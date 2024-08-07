import "dotenv/config";
import generateDateRangeArray from "./generateDateRangeArray/GenerateDateRangeArray";
import getNewContribution from "./getNewContribution/GetNewContribution";
import getBestStocksByDay from "./getBestStocksByDay/GetBestStocksByDay";
import getTheDaysOperations from "./getTheDaysOperations/GetTheDaysOperations";
import getDivEarning from "./getDivEarning/GetDivEarning";
import getAllStocks from "./getAllStocks/GetAllStocks";
import getNewDivAnnouncementList from "./getNewDivAnnouncementList/GetNewDivAnnouncementList";
import calculateStockPosition from "./calculateStockPosition/CalculateStockPosition";
import calculateTotalValueOperation from "./calculateTotalValueOperation/CalculateTotalValueOperation";
import getPaydayStock from "./getPaydayStock/GetPaydayStock";
import { addDataToCSV, deleteAllOutputFiles } from "./csv/Csv";
import calculatePurchaseCost from "./calculatePurchaseCost/CalculatePurchaseCost";
import getLastDayOfEachMonth from "./getLastDayOfEachMonth/GetLastDayOfEachMonth";
import combinePaydaysByMonthYear from "./combinePaydaysByMonthYear/CombinePaydaysByMonthYear";

const backtesting_stock_purchase = async () => {
  try {
    console.log("Iniciando o backtesting");
    const config = {
      startDate: process.env.START_DATE,
      endDate: process.env.END_DATE,
      monthlyContribution: process.env.MONTHLY_CONTRIBUTION,
      increaseInAnnualContribution: process.env.INCREASE_IN_ANNUAL_CONTRIBUTION,
      minAcceptAnnualNetProfit: process.env.MIN_ACCEPTABLE_ANNUAL_NET_PROFIT,
      minAcceptAnnualDividends: process.env.MIN_ACCEPTABLE_ANNUAL_DIVIDENDS,
    };
    console.log(JSON.stringify(config, null, 2));

    // let balance = 0;
    // let contributionValue = parseFloat(process.env.MONTHLY_CONTRIBUTION || "0");
    // let numContributions = 0;
    // let operations = [];
    // let listDivToReceive = [];
    // let listDivReceived = []
    // let purchaseCost = []

    const allStocks = await getAllStocks();

    if (!allStocks) {
      throw new Error("Erro ao obter a lsita de ações");
    }
    const dateRangeArray = generateDateRangeArray();
    const bestStocksByDay = await getBestStocksByDay(dateRangeArray, allStocks);
    // const listDiv = getDivEarning(bestStocksByDay, allStocks);

    // for (const date of dateRangeArray) {
    //   // console.log("date: ", date);
    //   // Posição atual das ações
    //   const stockPosition = calculateStockPosition(operations);

    //   // Atualizando o balance com aportes mensais
    //   const newContribution = getNewContribution({
    //     date,
    //     contributionValue,
    //     numContributions,
    //   });
    //   if (newContribution) {
    //     balance += newContribution;
    //     contributionValue = newContribution;
    //     numContributions >= 12 ? (numContributions = 1) : numContributions++;
    //   }

    //   // Lista de todos os div anunciado (data com) do dia especifico
    //   const newDivAnnouncementList = getNewDivAnnouncementList(
    //     listDiv,
    //     date,
    //     stockPosition
    //   );
    //   listDivToReceive.push(...newDivAnnouncementList);

    //   // Total pago por dividendos no dia especifico
    //   const totalPaydayByDate = getPaydayStock(listDivToReceive, date);
    //   listDivReceived.push({date: date, payday: totalPaydayByDate})
    //   balance += totalPaydayByDate;

    //   const daysOperations: any = getTheDaysOperations({
    //     date,
    //     bestStocksByDay,
    //     balance,
    //   });
    //   balance -= calculateTotalValueOperation(daysOperations);
    //   operations.push(...daysOperations);

    //   const result = {
    //     "No dia": date,
    //     "Custo de aquisição": undefined,
    //     "Saldo finalizou em": +balance.toFixed(2),
    //     "Teve um aporte de": +newContribution.toFixed(2),
    //     "Proventos recebido": +totalPaydayByDate.toFixed(2),
    //   };
    //   // console.log(JSON.stringify(result, null, 2));

    //   // Lista do custo de aquisição de cada mês
    //   const purchaseCostByDate = calculatePurchaseCost(stockPosition)
    //   purchaseCost.push({date: date, purchaseCost: +purchaseCostByDate.toFixed(2)})
    // }
    // Último dia de cada mes
    // const lastDayPurchaseCost = getLastDayOfEachMonth(purchaseCost)
    // const paydaysByMonthYear = combinePaydaysByMonthYear(listDivReceived)
    // console.log('lastDayPurchaseCost:', lastDayPurchaseCost)
    // console.log('paydaysByMonthYear:', paydaysByMonthYear)
    // console.log('listDivReceived:', listDivReceived)

    // console.log({
    //   "Custo de aquisição": lastDayPurchaseCost[lastDayPurchaseCost.length - 1],
    //   "Proventos acumulados": paydaysByMonthYear.reduce((acc, { payday }) => acc + payday, 0),
    // })

    // deleteAllOutputFiles();
    // addDataToCSV(operations);
  } catch (error) {
    console.error("Erro ao executar o backtesting", error);
  } finally {
    console.log("Backtesting finalizado");
  }
};
backtesting_stock_purchase();
