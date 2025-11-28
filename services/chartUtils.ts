export interface ChartDataPoint {
  timestamp: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

export interface FormattedChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }>;
  legend?: string[];
}

/**
 * Transform Alpha Vantage time series data into react-native-chart-kit format
 */
export const transformTimeSeriesData = (
  apiResponse: any,
  dataPoints: number = 30
): FormattedChartData => {
  // Extract the time series data (could be Daily, Weekly, Intraday, etc.)
  let timeSeries =
    apiResponse["Time Series (Daily)"] ||
    apiResponse["Time Series (Weekly)"] ||
    apiResponse["Time Series (Monthly)"] ||
    apiResponse["Time Series (1min)"] ||
    apiResponse["Time Series (5min)"] ||
    apiResponse["Time Series (15min)"] ||
    apiResponse["Time Series (30min)"] ||
    apiResponse["Time Series (60min)"];

  if (!timeSeries) {
    return {
      labels: [],
      datasets: [{ data: [] }],
    };
  }

  // Convert to array and sort by date (oldest first)
  const entries = Object.entries(timeSeries)
    .map(([timestamp, data]: [string, any]) => ({
      timestamp,
      close: parseFloat(data["4. close"]),
      open: parseFloat(data["1. open"]),
      high: parseFloat(data["2. high"]),
      low: parseFloat(data["3. low"]),
      volume: parseInt(data["5. volume"]),
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Take only the last N data points
  const recentData = entries.slice(-dataPoints);

  // Format dates for labels (shortened for display)
  const labels = recentData.map((point) => {
    const date = new Date(point.timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  // Extract close prices for the main chart
  const closeData = recentData.map((point) => point.close);

  return {
    labels,
    datasets: [
      {
        data: closeData,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green
        strokeWidth: 2,
      },
    ],
    legend: ["Close Price"],
  };
};

/**
 * Get raw data points for advanced charting
 */
export const getRawChartData = (apiResponse: any): ChartDataPoint[] => {
  let timeSeries =
    apiResponse["Time Series (Daily)"] ||
    apiResponse["Time Series (Weekly)"] ||
    apiResponse["Time Series (Monthly)"] ||
    apiResponse["Time Series (1min)"] ||
    apiResponse["Time Series (5min)"] ||
    apiResponse["Time Series (15min)"] ||
    apiResponse["Time Series (30min)"] ||
    apiResponse["Time Series (60min)"];

  if (!timeSeries) {
    return [];
  }

  return Object.entries(timeSeries)
    .map(([timestamp, data]: [string, any]) => ({
      timestamp,
      close: parseFloat(data["4. close"]),
      open: parseFloat(data["1. open"]),
      high: parseFloat(data["2. high"]),
      low: parseFloat(data["3. low"]),
      volume: parseInt(data["5. volume"]),
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

/**
 * Calculate technical indicators
 */
export const calculateMovingAverage = (
  data: ChartDataPoint[],
  period: number = 7
): number[] => {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(0);
      continue;
    }

    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, point) => acc + point.close, 0);
    result.push(sum / period);
  }

  return result;
};

/**
 * Format large numbers for display
 */
export const formatVolume = (volume: number): string => {
  if (volume >= 1_000_000_000) {
    return (volume / 1_000_000_000).toFixed(2) + "B";
  }
  if (volume >= 1_000_000) {
    return (volume / 1_000_000).toFixed(2) + "M";
  }
  if (volume >= 1_000) {
    return (volume / 1_000).toFixed(2) + "K";
  }
  return volume.toString();
};
