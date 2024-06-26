import moment from 'moment';

// Definição da interface para os dados de entrada
interface PurchaseData {
  date: string;
  purchaseCost: number;
}

// Definição do tipo para o array de dados de entrada
type PurchaseDataArray = PurchaseData[];

// Função principal para pegar o último dia de cada mês
export default function getLastDayOfEachMonth(data: PurchaseDataArray): PurchaseDataArray {
  // Validar dados recebidos
  if (!validateDataArray(data)) {
    throw new Error('Invalid data format');
  }

  const result: PurchaseDataArray = [];
  let currentMonth: number | null = null;
  let lastDay: PurchaseData | null = null;

  // Iterar sobre os dados
  for (const item of data) {
    const date = moment(item.date, 'DD/MM/YYYY');
    const month = date.month();

    // Se mudarmos de mês, adicionar o último dia do mês anterior
    if (currentMonth !== month) {
      if (lastDay) {
        result.push(lastDay);
      }
      currentMonth = month;
    }
    lastDay = item;
  }

  // Adicionar o último dia do último mês
  if (lastDay) {
    result.push(lastDay);
  }

  return result;
}

// Função para validar o array de dados
function validateDataArray(data: any): data is PurchaseDataArray {
  if (!Array.isArray(data)) return false;

  return data.every(item => validateDataItem(item));
}

// Função para validar cada item de dados
function validateDataItem(item: any): item is PurchaseData {
  if (typeof item !== 'object' || item === null) return false;
  if (typeof item.date !== 'string' || !moment(item.date, 'DD/MM/YYYY', true).isValid()) return false;
  if (typeof item.purchaseCost !== 'number') return false;

  return true;
}