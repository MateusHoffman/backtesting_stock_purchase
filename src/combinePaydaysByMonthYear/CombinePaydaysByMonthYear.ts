import moment from "moment";

// Definição da interface para os dados de entrada
interface IPaydayData {
  date: string;
  payday: number;
}

// Definição do tipo para o array de dados de entrada
type PaydayDataArray = IPaydayData[];

// Função principal para combinar valores de payday para o mesmo mês e ano
export default function combinePaydaysByMonthYear(data: PaydayDataArray): PaydayDataArray {
  try {
    // Validar dados recebidos
    validateDataArray(data);

    // Combinar paydays por mês e ano
    const combined = combineByMonthYear(data);

    // Converter o objeto combinado de volta para um array
    return convertToResultArray(combined);
  } catch (error: any) {
    console.error("Error:", error.message);
    return [];
  }
}

// Função para validar o array de dados
function validateDataArray(data: any): asserts data is PaydayDataArray {
  if (!Array.isArray(data)) {
    throw new Error("Data is not an array");
  }

  data.forEach(validateDataItem);
}

// Função para validar cada item de dados
function validateDataItem(item: any): asserts item is IPaydayData {
  if (typeof item !== "object" || item === null) {
    throw new Error("Item is not an object");
  }
  if (
    typeof item.date !== "string" ||
    !moment(item.date, "DD/MM/YYYY", true).isValid()
  ) {
    throw new Error("Invalid date format");
  }
  if (typeof item.payday !== "number") {
    throw new Error("Payday is not a number");
  }
}

// Função para combinar paydays por mês e ano
function combineByMonthYear(data: PaydayDataArray): { [key: string]: number } {
  return data.reduce((acc, item) => {
    const date = moment(item.date, "DD/MM/YYYY");
    const key = date.format("MM/YYYY");

    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += item.payday;

    return acc;
  }, {} as { [key: string]: number });
}

// Função para converter o objeto combinado de volta para um array
function convertToResultArray(combined: {
  [key: string]: number;
}): PaydayDataArray {
  return Object.entries(combined).map(([key, payday]) => {
    const [month, year] = key.split("/");
    const date = moment(`01/${month}/${year}`, "DD/MM/YYYY")
      .endOf("month")
      .format("DD/MM/YYYY");
    return { date, payday };
  });
}
