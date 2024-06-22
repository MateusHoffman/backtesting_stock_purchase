// Interface for the fetch options
interface FetchOptions {
  method: string;
  headers: Record<string, string>;
  body?: any;
}

// Function to perform API fetch with retries
export default async function fetchAPI(
  url: string,
  requestOptions: FetchOptions
): Promise<any | null> {
  let retryCount = 0;

  // Retry logic with a maximum of 5 attempts
  while (retryCount < 5) {
    try {
      // Perform the fetch operation
      const response: Response = await fetch(url, requestOptions);

      // Handle successful response
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      // Handle rate limiting (429 status)
      else if (response.status === 429) {
        const waitTime = Math.pow(2, retryCount) * 1000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        retryCount++;
      }
      // Handle server errors (500-599 status)
      else if (response.status >= 500 && response.status <= 599) {
        retryCount++;
        console.debug(
          `${retryCount}º Attempt - Request Failed! Status: ${response.status}`
        );
      }
      // Handle other non-successful responses
      else {
        console.warn("Request Failed! Status:", response.status);
        break;
      }
    } catch (error) {
      console.warn("Error in fetchAPI:", error);
      break;
    }
  }

  return null; // Return null if all retries fail
}
