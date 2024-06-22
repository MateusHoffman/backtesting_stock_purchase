import "dotenv/config";
import generateDateRangeArray from "./generateDateRangeArray/GenerateDateRangeArray";
import getNewContribution from "./getNewContribution/GetNewContribution";

const backtesting_stock_purchase = () => {
  try {
    console.log("Iniciando o backtesting");

    let balance = 0;
    let contributionValue = parseFloat(process.env.MONTHLY_CONTRIBUTION || "0");
    let numContributions = 0;

    // Lista de datas by data de início e fim
    const dateRangeArray = generateDateRangeArray();

    for (const date of dateRangeArray) {
      // Atualizando o balance com aportes mensais
      const newContribution = getNewContribution({
        date,
        contributionValue,
        numContributions,
      });
      if (newContribution) {
        balance += newContribution;
        contributionValue = newContribution;
        numContributions >= 12 ? (numContributions = 1) : numContributions++;
      }

      const result = {
        'No dia': date,
        'Saldo finalizou em': balance,
        'Teve um aporte de': newContribution,
        'Proventos recebido': undefined,
      }
      // console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error("Erro ao executar o backtesting", error);
  } finally {
    console.log("Backtesting finalizado");
  }
};
backtesting_stock_purchase();
