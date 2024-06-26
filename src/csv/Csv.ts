import fs from "fs";

const baseFileName = "output";
const fileExtension = ".csv";
const maxLinesPerFile = 90;

// Função para obter o caminho do arquivo atual considerando o limite de linhas
const getCurrentFilePath = (index: number): string => {
  return `${baseFileName}_${index}${fileExtension}`;
};

export function addDataToCSV(list: any[]) {
  try {
    let linesWritten = 0;
    let fileIndex = 0;
    let filePath = getCurrentFilePath(fileIndex);

    // Iterar sobre os itens da lista
    for (let i = 0; i < list.length; i++) {
      // Se o arquivo atual atingir o limite de linhas, avançar para o próximo arquivo
      if (linesWritten >= maxLinesPerFile) {
        fileIndex += 1;
        filePath = getCurrentFilePath(fileIndex);
        linesWritten = 0; // Resetar o contador de linhas escritas
      }

      // Se o arquivo não existir, escrever o cabeçalho
      if (!fs.existsSync(filePath)) {
        // const headers = "Ticker, Date, Price, Quantity, Type, Expenses\n";
        fs.writeFileSync(filePath, "", "utf8");
        linesWritten += 1; // Contar a linha do cabeçalho
      }

      // Formatar a linha de dados atual
      const item = list[i];
      const newDataLine = `${item.ticker}, ${item.date}, "${item.price}", ${item.quantity}, ${item.type}, ${item.expenses}\n`;

      // Adicionar a linha ao arquivo atual
      fs.appendFileSync(filePath, newDataLine, "utf8");
      linesWritten += 1; // Incrementar o contador de linhas escritas
    }

    console.log(`Dados adicionados aos arquivos CSV.`);
  } catch (error: any) {
    console.log(`Erro ao adicionar dados aos arquivos CSV: ${error.message}`);
  }
}

// Função para deletar todos os arquivos CSV gerados
export function deleteAllOutputFiles() {
  try {
    let fileIndex = 0;
    let filePath = getCurrentFilePath(fileIndex);
    let deletedCount = 0;

    while (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deletedCount += 1;
      fileIndex += 1;
      filePath = getCurrentFilePath(fileIndex);
    }

    console.log(`Foram deletados ${deletedCount} arquivo(s) CSV.`);
  } catch (error) {
    console.error(`Erro ao deletar os arquivos CSV: ${error}`);
  }
}
