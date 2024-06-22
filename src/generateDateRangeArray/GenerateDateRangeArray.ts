// Definindo tipos e interfaces para melhor estruturação do código
export interface DateRange {
  startDate: string;
  endDate: string;
}

type DateStringArray = string[];

// Função principal que retorna um array de strings com as datas no formato DD/MM/YYYY
export default function generateDateRangeArray(): DateStringArray {
  const range: DateRange = {
    startDate: process.env.START_DATE || "",
    endDate: process.env.END_DATE || "",
  };

  // Valida o intervalo de datas fornecido
  validateDateRange(range);

  // Converte a data inicial e final para objetos Date
  const startDate = parseDate(range.startDate);
  const endDate = parseDate(range.endDate);

  // Gera o array de datas
  return generateDateArray(startDate, endDate);
}

// Função para validar o intervalo de datas fornecido
export function validateDateRange(range: DateRange): void {
  try {
    // Valida o formato das datas
    validateDateFormat(range.startDate);
    validateDateFormat(range.endDate);

    // Valida se a data inicial é anterior ou igual à data final
    const startDate = parseDate(range.startDate);
    const endDate = parseDate(range.endDate);

    if (startDate > endDate) {
      throw new Error("A data inicial deve ser anterior ou igual à data final.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Erro na validação do intervalo de datas: ${error.message}`);
    } else {
      // Se for um tipo desconhecido diferente de Error, trate de outra forma
      throw new Error(`Erro na validação do intervalo de datas: ${String(error)}`);
    }
  }
}


// Função para validar o formato da data
export function validateDateFormat(dateString: string): void {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) {
    throw new Error(`Formato de data inválido: ${dateString}. Use DD/MM/YYYY.`);
  }
}

// Função para converter uma string de data no formato DD/MM/YYYY para um objeto Date
export function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

// Função para gerar um array de datas entre duas datas
export function generateDateArray(startDate: Date, endDate: Date): DateStringArray {
  const dateArray: DateStringArray = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

// Função para formatar um objeto Date no formato DD/MM/YYYY
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
