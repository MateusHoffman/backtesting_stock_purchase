// Interfaces
export interface ContributionData {
  date: string;
  contributionValue: number;
  numContributions: number;
}

// Tipos
export type ValidationResult = {
  isValid: boolean;
  errorMessage?: string;
};

export type DateFormats = "DD/MM/YYYY";

// Função para validar o formato da data
export function validateDateFormat(
  date: string,
  format: DateFormats
): ValidationResult {
  const dateFormatRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!dateFormatRegex.test(date)) {
    return {
      isValid: false,
      errorMessage: "Formato de data inválido. Use DD/MM/YYYY.",
    };
  }
  return { isValid: true };
}

// Função para validar se contributionValue é um número
export function validateContributionValue(value: any): ValidationResult {
  if (typeof value !== "number" || isNaN(value)) {
    return {
      isValid: false,
      errorMessage: "Valor da contribuição deve ser um número.",
    };
  }
  return { isValid: true };
}

// Função para validar se numContributions é um número
export function validateNumContributions(value: any): ValidationResult {
  if (typeof value !== "number" || isNaN(value)) {
    return {
      isValid: false,
      errorMessage: "Número de contribuições deve ser um número.",
    };
  }
  return { isValid: true };
}

// Função para validar e converter aumento anual de contribuição para número
export function validateIncInAnnualContribution(
  value: string | undefined
): ValidationResult {
  if (!value || isNaN(parseFloat(value))) {
    return {
      isValid: false,
      errorMessage:
        "O aumento anual de contribuição deve ser um número válido.",
    };
  }
  return { isValid: true };
}

// Função principal
export default function getNewContribution(data: ContributionData): number {
  const incInAnnualContributionStr =
    process.env.INCREASE_IN_ANNUAL_CONTRIBUTION;

  // Validar e converter aumento anual de contribuição para número
  const incInAnnualContributionValidation = validateIncInAnnualContribution(
    incInAnnualContributionStr
  );

  // Se houver erros de validação, lançar exceção
  if (!incInAnnualContributionValidation.isValid) {
    throw new Error(
      `Aumento anual de contribuição inválido: ${incInAnnualContributionValidation.errorMessage}`
    );
  }

  // Converter para número
  const incInAnnualContribution = parseFloat(incInAnnualContributionStr!);

  // Validação dos outros dados recebidos
  const dateValidation = validateDateFormat(data.date, "DD/MM/YYYY");
  const valueValidation = validateContributionValue(data.contributionValue);
  const numValidation = validateNumContributions(data.numContributions);

  // Se houver erros de validação, lançar exceção
  if (
    !dateValidation.isValid ||
    !valueValidation.isValid ||
    !numValidation.isValid
  ) {
    throw new Error(
      `Dados inválidos:\n${dateValidation.errorMessage}\n${valueValidation.errorMessage}\n${numValidation.errorMessage}`
    );
  }

  // Verifica se é o dia primeiro do mês e o número de contribuições está no intervalo especificado
  const isFirstDayOfMonth = data.date.startsWith("01/");
  if (isFirstDayOfMonth) {
    if (data.numContributions >= 12) {
      return +(data.contributionValue * incInAnnualContribution).toFixed(2);
    }
    return data.contributionValue;
  } else {
    return 0;
  }
}
