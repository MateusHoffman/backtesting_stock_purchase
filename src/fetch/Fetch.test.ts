import fetchAPI from "./Fetch";

// Mocking fetch to simulate responses
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

describe("fetchAPI function", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should fetch data successfully", async () => {
    // Mock a successful response
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({ message: "Mock data" }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const url = "https://example.com/api";
    const requestOptions = { method: "GET", headers: {} };

    const result = await fetchAPI(url, requestOptions);

    expect(result).toEqual({ message: "Mock data" });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(url, requestOptions);
  });

  it("should handle server errors (500-599 status)", async () => {
    // Mock a server error response
    const mockResponse = {
      ok: false,
      status: 503,
    };
    mockFetch.mockResolvedValue(mockResponse);

    const url = "https://example.com/api";
    const requestOptions = { method: "GET", headers: {} };

    await fetchAPI(url, requestOptions);

    expect(mockFetch).toHaveBeenCalledTimes(5); // Should retry 5 times
    expect(mockFetch).toHaveBeenCalledWith(url, requestOptions);
  });

  it("should handle other non-successful responses", async () => {
    // Mock a response with non-successful status
    const mockResponse = {
      ok: false,
      status: 404,
    };
    mockFetch.mockResolvedValue(mockResponse);

    const url = "https://example.com/api";
    const requestOptions = { method: "GET", headers: {} };

    const result = await fetchAPI(url, requestOptions);

    expect(result).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(1); // Should not retry
    expect(mockFetch).toHaveBeenCalledWith(url, requestOptions);
  });

  it("should handle fetch errors", async () => {
    // Mock a fetch error
    mockFetch.mockRejectedValue(new Error("Fetch failed"));

    const url = "https://example.com/api";
    const requestOptions = { method: "GET", headers: {} };

    const result = await fetchAPI(url, requestOptions);

    expect(result).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(url, requestOptions);
  });
});
