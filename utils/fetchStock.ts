// utils/fetchStock.ts
import axios from 'axios';

const API_KEY = 'YOUR_API_KEY_HERE'; // 🔒 Replace with your actual Alpha Vantage key

export interface TimeSeriesData {
  [timestamp: string]: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };
}

export interface StockApiResponse {
  'Meta Data'?: Record<string, string>;
  'Time Series (1min)'?: TimeSeriesData;
  'Time Series (5min)'?: TimeSeriesData;
  'Time Series (15min)'?: TimeSeriesData;
  'Time Series (30min)'?: TimeSeriesData;
  'Time Series (60min)'?: TimeSeriesData;
  Note?: string;
  Information?: string;
  ErrorMessage?: string;
}

export const fetchStockData = async (
  symbol: string,
  interval: string
): Promise<StockApiResponse | null> => {
  try {
    const response = await axios.get<StockApiResponse>(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol,
          interval,
          apikey: API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return null;
  }
};