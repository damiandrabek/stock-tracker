import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.ALPHA_VANTAGE_API_KEY as string;
// const API_KEY = "34LLYCNS7QPX6HH1";
const BASE_URL = "https://www.alphavantage.co/query";

interface StockSearchResult {
  "1. symbol": string;
  "2. name": string;
}

interface TrendingStock {
  ticker: string;
  name?: string; // Sometimes present
}

interface FetchStocksParams {
  query?: string;
}

// Always return an array of names (string[])
export const fetchStocks = async ({
  query,
}: FetchStocksParams): Promise<string[]> => {
  let endpoint = "";

  if (query && query.trim() !== "") {
    // SYMBOL_SEARCH endpoint
    const params = new URLSearchParams({
      function: "SYMBOL_SEARCH",
      keywords: query,
      apikey: API_KEY,
    });
    endpoint = `${BASE_URL}?${params.toString()}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.Note) {
      // throw new Error("API rate limit reached. Please try again later.");
      return [
        "Apple Inc.",
        "Microsoft Corporation",
        "Tesla Inc.",
        "Amazon.com Inc.",
        "Alphabet Inc.",
      ];
    }
    if (data.bestMatches) {
      return (data.bestMatches as StockSearchResult[]).map(
        (item) => item["2. name"]
      );
    }
    return [];
  } else {
    // TOP_GAINERS_LOSERS endpoint
    const params = new URLSearchParams({
      function: "TOP_GAINERS_LOSERS",
      apikey: API_KEY,
    });
    endpoint = `${BASE_URL}?${params.toString()}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.Note) {
      // throw new Error("API rate limit reached. Please try again later.");
      return [
        "Apple Inc.",
        "Microsoft Corporation",
        "Tesla Inc.",
        "Amazon.com Inc.",
        "Alphabet Inc.",
      ];
    }
    // Try all possible fields for top gainers/losers/most actively traded
    const lists = [
      ...(data.top_gainers ?? []),
      ...(data.top_losers ?? []),
      ...(data.most_actively_traded ?? []),
    ];
    if (lists.length > 0) {
      return lists.map((item: any) => item.ticker || item.symbol || "");
    }
    return [];
  }
};
