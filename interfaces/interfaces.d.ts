interface Stock {
  ticker: string;
  name: string;
  logo: string;
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  weburl: string;
  finnhubIndustry: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  highPriceOfTheDay: number;
  lowPriceOfTheDay: number;
  openPriceOfTheDay: number;
  previousClosePrice: number;
  shareOutstanding: number;
}

interface TrendingStock {
  searchTerm: string;
  stock_id: number;
  name: string;
  count: number;
  logo: string;
}

interface TrendingCardProps {
  stock: TrendingStock;
  index: number;
}

interface TimeSeriesData {
  [timestamp: string]: {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  };
}

interface StockTimeSeries {
  'Meta Data'?: Record<string, string>;
  'Time Series (60min)'?: TimeSeriesData;
  'Time Series (Daily)'?: TimeSeriesData;
  "Weekly Time Series"?: TimeSeriesData;
  "Monthly Time Series"?: TimeSeriesData;
  Note?: string;
  Information?: string;
  ErrorMessage?: string;
}