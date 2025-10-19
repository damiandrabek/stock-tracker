import Constants from "expo-constants";

const tickerWatchlist = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "NVDA",
  "META",
  "BRK.B",
  "JPM",
  "V",
  "ASML",
  "AVGO",
];
const randomTicker =
  tickerWatchlist[Math.floor(Math.random() * tickerWatchlist.length)];

export const ALPHA_VANTAGE_CONFIG = {
  BASE_URL: "https://www.alphavantage.co/query?",
  API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
  headers: {
    accept: "application/json",
  },
};

export const FINNHUB_CONFIG = {
  BASE_URL: "https://finnhub.io/api/v1",
  API_KEY: Constants.expoConfig?.extra?.FINNHUB_API_KEY,
  headers: {
    accept: "application/json",
  },
};

// export const fetchStocks = async ({ query }: { query: string }) => {

//   const endpoint = query
//     // ? `${ALPHA_VANTAGE_CONFIG.BASE_URL}function=GLOBAL_QUOTE&symbol=${encodeURIComponent(query)}&apikey=${ALPHA_VANTAGE_CONFIG.API_KEY}`
//     ? `${FINNHUB_CONFIG.BASE_URL}/quote?symbol=${encodeURIComponent(query)}&token=${FINNHUB_CONFIG.API_KEY}`

//     : `${FINNHUB_CONFIG.BASE_URL}/stock/profile2?symbol=${randomTicker}&token=${FINNHUB_CONFIG.API_KEY}`
//     // : `${ALPHA_VANTAGE_CONFIG.BASE_URL}function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_CONFIG.API_KEY}`
//     // : `${FINNHUB_CONFIG.BASE_URL}/stock/symbol?exchange=US&token=${FINNHUB_CONFIG.API_KEY}`;

//   const response = await fetch(endpoint, {
//     method: 'GET',
//     headers: FINNHUB_CONFIG.headers,
//   })

//   if(!response.ok) {
//     // @ts-ignore
//     throw new Error('Failed to fetch stocks', response.statusText);
//   }

//   const data = await response.json();
//   console.log('Fetched stock data:', data);
//   return data

// }

export const fetchStocksOnWatchlist = async () => {
  const promises = tickerWatchlist.map(async (ticker) => {
    // Fetch profile
    const profileEndpoint = `${FINNHUB_CONFIG.BASE_URL}/stock/profile2?symbol=${encodeURIComponent(ticker)}&token=${FINNHUB_CONFIG.API_KEY}`;
    const profileRes = await fetch(profileEndpoint, {
      method: "GET",
      headers: FINNHUB_CONFIG.headers,
    });
    if (!profileRes.ok)
      throw new Error(`Failed to fetch profile for: ${ticker}`);
    const profile = await profileRes.json();

    // Fetch quote
    const quoteEndpoint = `${FINNHUB_CONFIG.BASE_URL}/quote?symbol=${encodeURIComponent(ticker)}&token=${FINNHUB_CONFIG.API_KEY}`;
    const quoteRes = await fetch(quoteEndpoint, {
      method: "GET",
      headers: FINNHUB_CONFIG.headers,
    });
    if (!quoteRes.ok) throw new Error(`Failed to fetch quote for: ${ticker}`);
    const quote = await quoteRes.json();

    // merge and return
    return {
      ...profile,
      currentPrice: quote.c,
      change: quote.d,
      percentChange: quote.dp,
      highPriceOfTheDay: quote.h,
      lowPriceOfTheDay: quote.l,
      openPriceOfTheDay: quote.o,
      previousClosePrice: quote.pc,
    };
  });

  const data = await Promise.all(promises);
  console.log("Fetched stock data:", data);
  return data;
};

export const fetchStocksForLookUp = async ({ query }: { query: string }) => {
  let symbols: string[] = [];

  if (query) {
    // 1. Fetch best-matching symbols from Finnhub
    const endpoint = `${FINNHUB_CONFIG.BASE_URL}/search?q=${encodeURIComponent(query)}&token=${FINNHUB_CONFIG.API_KEY}`;
    const symbolLookUpResponse = await fetch(endpoint, {
      method: "GET",
      headers: FINNHUB_CONFIG.headers,
    });

    if (!symbolLookUpResponse.ok) {
      throw new Error("Failed to look up stocks");
    }

    const symbolResponse = await symbolLookUpResponse.json();

    // 2. Extract just the 'symbol' field from the result array
    symbols = (symbolResponse.result || [])
      .map((result: any) => result.symbol)
      .filter((s: string) => !!s)
      .slice(0, 25); // limit to 25 results
  } else {
    // No query: use the watchlist
    symbols = tickerWatchlist;
  }

  // 3. For each symbol, fetch profile and quote, then merge
  const promises = symbols.map(async (ticker: string) => {
    // Fetch profile
    const profileEndpoint = `${FINNHUB_CONFIG.BASE_URL}/stock/profile2?symbol=${encodeURIComponent(ticker)}&token=${FINNHUB_CONFIG.API_KEY}`;
    const profileRes = await fetch(profileEndpoint, {
      method: "GET",
      headers: FINNHUB_CONFIG.headers,
    });

    let profile = await profileRes.json();

    // If no access, return fallback object
    if (profile.error) {
      return {
        ticker,
        name: ticker, // fallback to ticker as name
        noAccess: true,
      };
    }

    // Fetch quote
    const quoteEndpoint = `${FINNHUB_CONFIG.BASE_URL}/quote?symbol=${encodeURIComponent(ticker)}&token=${FINNHUB_CONFIG.API_KEY}`;
    const quoteRes = await fetch(quoteEndpoint, {
      method: "GET",
      headers: FINNHUB_CONFIG.headers,
    });

    let quote = await quoteRes.json();

    // If no access to quote, still return profile info
    if (quote.error) {
      return {
        ...profile,
        ticker,
        name: profile.name || ticker,
        noAccess: true,
      };
    }

    // merge and return
    return {
      ...profile,
      currentPrice: quote.c,
      change: quote.d,
      percentChange: quote.dp,
      highPriceOfTheDay: quote.h,
      lowPriceOfTheDay: quote.l,
      openPriceOfTheDay: quote.o,
      previousClosePrice: quote.pc,
      ticker,
      name: profile.name || ticker,
    };
  });

  const data = await Promise.all(promises);
  console.log("Fetched searched for stock data:", data);
  return data;
};

export const fetchStockDetails = async (stockId: string): Promise<Stock> => {
  
  // Fetch profile
  const profileEndpoint = `${FINNHUB_CONFIG.BASE_URL}/stock/profile2?symbol=${encodeURIComponent(stockId)}&token=${FINNHUB_CONFIG.API_KEY}`;
  const profileRes = await fetch(profileEndpoint, {
    method: "GET",
    headers: FINNHUB_CONFIG.headers,
  });
  if (!profileRes.ok)
    throw new Error(`Failed to fetch profile for: ${stockId}`);
  const profile = await profileRes.json();

  // Fetch quote
  const quoteEndpoint = `${FINNHUB_CONFIG.BASE_URL}/quote?symbol=${encodeURIComponent(stockId)}&token=${FINNHUB_CONFIG.API_KEY}`;
  const quoteRes = await fetch(quoteEndpoint, {
    method: "GET",
    headers: FINNHUB_CONFIG.headers,
  });
  if (!quoteRes.ok) throw new Error(`Failed to fetch quote for: ${stockId}`);
  const quote = await quoteRes.json();

  // merge and return
  const data = await {
    ...profile,
    currentPrice: quote.c,
    change: quote.d,
    percentChange: quote.dp,
    highPriceOfTheDay: quote.h,
    lowPriceOfTheDay: quote.l,
    openPriceOfTheDay: quote.o,
    previousClosePrice: quote.pc,
  };
  
  console.log("Fetched stock data:", data);
  return data;
}