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
