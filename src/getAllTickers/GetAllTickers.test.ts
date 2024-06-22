import { fetchTickers, formatTickers } from "./GetAllTickers";
import fetchAPI from "../fetch/Fetch";

jest.mock("../fetch/Fetch");

describe("GetAllTickers.test.ts", () => {
  describe("fetchTickers function", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("fetches tickers successfully", async () => {
      const mockResponse = {
        list: [{ ticker: "AAPL" }, { ticker: "MSFT" }, { ticker: "GOOGL" }],
      };
      (fetchAPI as jest.Mock).mockResolvedValue(mockResponse);

      const tickers = await fetchTickers();
      expect(tickers).toEqual(mockResponse.list);
    });

    it("throws an error when fetchAPI returns an invalid response", async () => {
      const mockResponse = { invalidData: true }; // Invalid response structure
      (fetchAPI as jest.Mock).mockResolvedValue(mockResponse);

      await expect(fetchTickers()).rejects.toThrow(
        "Failed to fetch data or data format is incorrect."
      );
    });

    it("throws an error when fetchAPI fails", async () => {
      const errorMessage = "Network error";
      (fetchAPI as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(fetchTickers()).rejects.toThrow(errorMessage);
    });
  });

  describe("formatTickers function", () => {
    it("formats an array of tickers correctly", () => {
      const tickers = [
        { ticker: "AAPL" },
        { ticker: "MSFT" },
        { ticker: "AAPL" },
      ];
      const formattedTickers = formatTickers(tickers);
      expect(formattedTickers).toEqual(["AAPL", "MSFT"]);
    });

    it("returns an empty array when input is empty", () => {
      const tickers: any[] = [];
      const formattedTickers = formatTickers(tickers);
      expect(formattedTickers).toEqual([]);
    });

    it("throws an error when input is not an array", () => {
      const invalidInput: any = "invalid input";
      expect(() => formatTickers(invalidInput)).toThrow();
    });

    it("handles duplicate and mixed-case tickers", () => {
      const tickers = [
        { ticker: "AAPL" },
        { ticker: "msft" },
        { ticker: "AAPL" },
        { ticker: "GOOGL" },
        { ticker: "AAPL" },
      ];
      const formattedTickers = formatTickers(tickers);
      expect(formattedTickers).toEqual(["AAPL", "msft", "GOOGL"]);
    });
  });
});
