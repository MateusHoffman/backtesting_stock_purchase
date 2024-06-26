import fs from "fs";
import * as xlsx from "xlsx";

const fileName = "statusinvest.xlsx";

// Função para criar uma nova planilha com cabeçalho
const createSheet = (): xlsx.WorkSheet => {
  const headers = [
    "Data operação",
    "Categoria",
    "Código Ativo",
    "Operação C/V",
    "Quantidade",
    "Preço unitário",
    "Corretora",
    "Corretagem",
    "Taxas",
    "Impostos",
    "IRRF",
  ];
  const worksheet: xlsx.WorkSheet = xlsx.utils.aoa_to_sheet([headers]);
  return worksheet;
};

export function addDataToExcel(list: any[]) {
  try {
    const workbook: xlsx.WorkBook = xlsx.utils.book_new();
    const sheet: xlsx.WorkSheet = createSheet();
    const data: any[] = [];

    // Iterar sobre os itens da lista e formatar as linhas de dados
    list.forEach((item) => {
      const newRow = [
        item.date,
        "Ações",
        item.ticker,
        "C",
        item.quantity,
        item.price,
        "CLEAR CORRETORA",
        0,
        0,
        0,
        0,
      ];
      data.push(newRow);
    });

    // Adicionar os dados formatados à planilha
    xlsx.utils.sheet_add_aoa(sheet, data, { origin: -1 });

    // Adicionar a planilha ao workbook
    xlsx.utils.book_append_sheet(workbook, sheet, "Dados");

    // Escrever o arquivo xlsx
    xlsx.writeFile(workbook, fileName);
    console.log(`Dados adicionados ao arquivo Excel.`);
  } catch (error: any) {
    console.log(`Erro ao adicionar dados ao arquivo Excel: ${error.message}`);
  }
}

// Função para deletar o arquivo Excel gerado
export function deleteOutputFile() {
  try {
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
      console.log(`Arquivo Excel deletado.`);
    } else {
      console.log(`Nenhum arquivo Excel encontrado para deletar.`);
    }
  } catch (error) {
    console.error(`Erro ao deletar o arquivo Excel: ${error}`);
  }
}
