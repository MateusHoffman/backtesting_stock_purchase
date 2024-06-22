// ARQUIVO: GenerateDateRangeArray.test.ts
import generateDateRangeArray, {
  validateDateRange,
  validateDateFormat,
  parseDate,
  generateDateArray,
  formatDate,
} from "./GenerateDateRangeArray";

describe("GenerateDateRangeArray.test.ts", () => {
  // Limpar variáveis de ambiente antes de cada teste
  beforeEach(() => {
    process.env.START_DATE = "";
    process.env.END_DATE = "";
  });

  describe("generateDateRangeArray", () => {
    it("should generate an array of date strings between startDate and endDate", () => {
      process.env.START_DATE = "01/06/2024";
      process.env.END_DATE = "05/06/2024";

      const result = generateDateRangeArray();
      expect(result).toEqual([
        "01/06/2024",
        "02/06/2024",
        "03/06/2024",
        "04/06/2024",
        "05/06/2024",
      ]);
    });

    it("should throw error if startDate is after endDate", () => {
      process.env.START_DATE = "05/06/2024";
      process.env.END_DATE = "01/06/2024";

      expect(() => generateDateRangeArray()).toThrow(
        "A data inicial deve ser anterior ou igual à data final."
      );
    });

    // Adicione mais testes para outros cenários específicos, se necessário
  });

  describe("validateDateRange", () => {
    it("should not throw error for a valid date range", () => {
      const range = {
        startDate: "01/06/2024",
        endDate: "05/06/2024",
      };
      expect(() => validateDateRange(range)).not.toThrow();
    });

    it("should throw error if startDate format is invalid", () => {
      const range = {
        startDate: "2024-06-01",
        endDate: "05/06/2024",
      };
      expect(() => validateDateRange(range)).toThrow(
        "Formato de data inválido: 2024-06-01. Use DD/MM/YYYY."
      );
    });

    it("should throw error if endDate format is invalid", () => {
      const range = {
        startDate: "01/06/2024",
        endDate: "2024-06-05",
      };
      expect(() => validateDateRange(range)).toThrow(
        "Formato de data inválido: 2024-06-05. Use DD/MM/YYYY."
      );
    });

    it("should throw error if startDate and endDate formats are invalid", () => {
      const range = {
        startDate: "2024-06-01",
        endDate: "2024-06-05",
      };
      expect(() => validateDateRange(range)).toThrow(
        "Formato de data inválido: 2024-06-01. Use DD/MM/YYYY."
      );
    });

    it("should throw error if startDate is after endDate", () => {
      const range = {
        startDate: "05/06/2024",
        endDate: "01/06/2024",
      };
      expect(() => validateDateRange(range)).toThrow(
        "A data inicial deve ser anterior ou igual à data final."
      );
    });
  });

  describe("validateDateFormat", () => {
    it("should not throw error for a valid date format", () => {
      const dateString = "01/06/2024";
      expect(() => validateDateFormat(dateString)).not.toThrow();
    });

    it("should throw error for an invalid date format", () => {
      const dateString = "2024-06-01";
      expect(() => validateDateFormat(dateString)).toThrow(
        "Formato de data inválido: 2024-06-01. Use DD/MM/YYYY."
      );
    });

    it("should throw error for an invalid year in date format", () => {
      const dateString = "01/06/10000";
      expect(() => validateDateFormat(dateString)).toThrow(
        "Formato de data inválido: 01/06/10000. Use DD/MM/YYYY."
      );
    });
  });

  describe("parseDate", () => {
    it("should correctly parse a valid date string", () => {
      const dateString = "01/06/2024";
      const result = parseDate(dateString);
      expect(result).toEqual(new Date(2024, 5, 1)); // JavaScript months are zero-indexed
    });

    // Adicione mais testes para diferentes strings de data, se necessário
  });

  describe("generateDateArray", () => {
    it("should generate an array of date strings between startDate and endDate", () => {
      const startDate = new Date(2024, 5, 1);
      const endDate = new Date(2024, 5, 5);
      const result = generateDateArray(startDate, endDate);
      expect(result).toEqual([
        "01/06/2024",
        "02/06/2024",
        "03/06/2024",
        "04/06/2024",
        "05/06/2024",
      ]);
    });

    it("should generate an array with a single date if startDate and endDate are the same", () => {
      const startDate = new Date(2024, 5, 1);
      const endDate = new Date(2024, 5, 1);
      const result = generateDateArray(startDate, endDate);
      expect(result).toEqual(["01/06/2024"]);
    });

    it("should handle leap years correctly", () => {
      const startDate = new Date(2020, 1, 28); // Leap year February
      const endDate = new Date(2020, 2, 1); // Leap year March
      const result = generateDateArray(startDate, endDate);
      expect(result).toEqual(["28/02/2020", "29/02/2020", "01/03/2020"]);
    });

    it("should handle different month lengths correctly", () => {
      const startDate = new Date(2024, 0, 30); // January (31 dias)
      const endDate = new Date(2024, 1, 2); // February (29 dias em ano bissexto)
      const result = generateDateArray(startDate, endDate);
      expect(result).toEqual([
        "30/01/2024",
        "31/01/2024",
        "01/02/2024",
        "02/02/2024",
      ]);
    });
  });

  describe("formatDate", () => {
    it("should format a Date object to DD/MM/YYYY format", () => {
      const date = new Date(2024, 5, 1);
      const result = formatDate(date);
      expect(result).toBe("01/06/2024");
    });

    it("should handle formatting correctly for single digit day and month", () => {
      const date = new Date(2024, 1, 3);
      const result = formatDate(date);
      expect(result).toBe("03/02/2024");
    });
  });
});
