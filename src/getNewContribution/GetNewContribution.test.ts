import getNewContribution, {
  validateDateFormat,
  validateContributionValue,
  validateNumContributions,
  validateIncInAnnualContribution,
} from "./GetNewContribution";

describe("GetNewContribution.test.ts", () => {
  describe("validateDateFormat function", () => {
    it("should return isValid true for valid date format", () => {
      const result = validateDateFormat("01/01/2023", "DD/MM/YYYY");
      expect(result.isValid).toBe(true);
    });

    it("should return isValid false for invalid date format", () => {
      const result = validateDateFormat("2023-01-01", "DD/MM/YYYY");
      expect(result.isValid).toBe(false);
    });

    it("should return isValid false for incomplete date format", () => {
      const result = validateDateFormat("01/2023", "DD/MM/YYYY");
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateContributionValue function", () => {
    it("should return isValid true for valid contribution value", () => {
      const result = validateContributionValue(1000);
      expect(result.isValid).toBe(true);
    });

    it("should return isValid false for non-number contribution value", () => {
      const result = validateContributionValue("1000");
      expect(result.isValid).toBe(false);
    });

    it("should return isValid false for NaN contribution value", () => {
      const result = validateContributionValue(NaN);
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateNumContributions function", () => {
    it("should return isValid true for valid number of contributions", () => {
      const result = validateNumContributions(12);
      expect(result.isValid).toBe(true);
    });

    it("should return isValid false for non-number number of contributions", () => {
      const result = validateNumContributions("12");
      expect(result.isValid).toBe(false);
    });

    it("should return isValid false for NaN number of contributions", () => {
      const result = validateNumContributions(NaN);
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateIncInAnnualContribution function", () => {
    it("should return isValid true for valid increase in annual contribution", () => {
      const result = validateIncInAnnualContribution("1.2");
      expect(result.isValid).toBe(true);
    });

    it("should return isValid false for invalid increase in annual contribution", () => {
      const result = validateIncInAnnualContribution("invalid");
      expect(result.isValid).toBe(false);
    });

    it("should return isValid false for missing increase in annual contribution", () => {
      const result = validateIncInAnnualContribution(undefined);
      expect(result.isValid).toBe(false);
    });
  });

  // Teste para a função principal getNewContribution
  describe("getNewContribution function", () => {
    it("should throw error for invalid increase in annual contribution", () => {
      const data = {
        date: "01/01/2023",
        contributionValue: 1000,
        numContributions: 12,
      };
      process.env.INCREASE_IN_ANNUAL_CONTRIBUTION = "invalid";

      // Utilizamos expect().toThrowError() para garantir que a função lance um erro
      expect(() => {
        getNewContribution(data);
      }).toThrowError("Aumento anual de contribuição inválido");
    });

    // Aqui podemos adicionar mais testes para diferentes cenários da função getNewContribution
    it("should return calculated contribution value for valid data on the first day of the month with 12 contributions", () => {
      const data = {
        date: "01/01/2023",
        contributionValue: 1000,
        numContributions: 12,
      };
      process.env.INCREASE_IN_ANNUAL_CONTRIBUTION = "1.2";

      const result = getNewContribution(data);
      expect(result).toBe(1200); // 1000 * 1.2 = 1200
    });

    it("should return original contribution value for valid data on the first day of the month with less than 12 contributions", () => {
      const data = {
        date: "01/01/2023",
        contributionValue: 1000,
        numContributions: 6,
      };
      process.env.INCREASE_IN_ANNUAL_CONTRIBUTION = "1.2";

      const result = getNewContribution(data);
      expect(result).toBe(1000); // 1000 contributions, no increase
    });

    it("should return 0 for non-first day of the month", () => {
      const data = {
        date: "02/01/2023",
        contributionValue: 1000,
        numContributions: 12,
      };
      process.env.INCREASE_IN_ANNUAL_CONTRIBUTION = "1.2";

      const result = getNewContribution(data);
      expect(result).toBe(0); // Not the first day of the month
    });
  });
});
