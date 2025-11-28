import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { StockChart } from "@/components/StockChart";
import { fetchStockDetails, fetchStockTimeSeries } from "@/services/api";
import { getRawChartData, transformTimeSeriesData } from "@/services/chartUtils";
import useFetch from "@/services/useFetch";

import { icons } from "@/constants/icons";

interface StockInfoProps {
  label: string;
  value: string | number | null | undefined;
  numLines?: number;
  isURL?: boolean;
}

const StockInfo = ({ label, value, numLines, isURL }: StockInfoProps) => {
  // Use a fixed column width so rows align. minWidth prevents excessive wrapping on narrow screens.
  const containerStyle = { flexBasis: '33.3333%', minWidth: 110, justifyContent: 'center' } as const;

  const openUrl = async (raw?: string | number | null | undefined) => {
    if (!raw) return;
    try {
      let url = raw.toString();
      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
      const { Linking } = await import('react-native');
      await Linking.openURL(url);
    } catch (err) {
      console.warn('Failed to open url', err);
    }
  };

  return (
    <View style={containerStyle} className="flex-col items-start justify-center mt-5 px-1">
      <Text className="text-light-200 font-normal text-sm" numberOfLines={1}>
        {label}
      </Text>

      {isURL && value ? (
        <TouchableOpacity onPress={() => openUrl(value)} activeOpacity={0.7} accessibilityRole="link" className="mt-2">
          <Text className="text-accent font-bold text-sm underline" numberOfLines={1} ellipsizeMode="tail">
            {value.toString().replace(/(^\w+:|^)\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text className="text-light-100 font-bold text-sm mt-2" numberOfLines={numLines || 2}>
          {value || 'N/A'}
        </Text>
      )}
    </View>
  );
};

const StockDetails = () => {
  const [selectedInterval, setSelectedInterval] = useState<"1D" | "1W" | "1M" | "3M" | "6M" | "YTD" | "1Y" | "3Y" | "5Y" | "ALL">("1M");
  
  const { id } = useLocalSearchParams();

  const fetchFnDetails = useCallback(() => fetchStockDetails(id as string), []);
  const {
    data: stock,
    loading: stockLoading,
    error: stockError,
  } = useFetch<Stock>(fetchFnDetails, true);

  const fetchFnTimeSeries = useCallback(
    () => fetchStockTimeSeries(id as string, selectedInterval),
    [id, selectedInterval]
  );
  const {
    data: stockTimeSeries,
    loading: stockTimeSeriesLoading,
    error: stockTimeSeriesError,
  } = useFetch(fetchFnTimeSeries, true);

  // const chartData removed — use formattedChartData below which adapts to selected interval
  const rawData = stockTimeSeries ? getRawChartData(stockTimeSeries) : [];
  const lastDataPoint = rawData.length > 0 ? rawData[rawData.length - 1] : null;

  // map selected interval to how many data points to show on the chart
  const intervalPointsMap: Record<string, number> = {
    '1D': 24,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 120,
    'YTD': 180,
    '1Y': 240,
    '3Y': 360,
    '5Y': 480,
    'ALL': 720,
  };

  const pointsToShow = intervalPointsMap[selectedInterval] || 30;
  const formattedChartData = stockTimeSeries ? transformTimeSeriesData(stockTimeSeries, pointsToShow) : null;


  return (
    <>
      <View className="bg-primary flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {stockLoading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="mt-10 self-center"
            />
          ) : stockError ? (
            <Text>Error: {stockError ? stockError.message : ""}</Text>
          ) : (
            <View className="w-full px-6">

              <View className="flex-row items-start justify-between mt-5 gap-x-2">
                <View className="flex-1 pr-3">
                  <View className="flex-col gap-1 mt-5 items-baseline">
                    <Text className="text-white font-bold text-4xl">
                      {stock?.ticker}
                    </Text>

                    <Text className="text-gray-300 font-sm">{stock?.name}</Text>
                  </View>

                  <View className="flex-row gap-6 mt-2 items-baseline">
                    <Text className="text-white font-bold text-3xl">
                      {stock?.currentPrice?.toFixed(2)}
                    </Text>

                    <Text
                      className={`text-lg font-medium ${
                        stock?.percentChange && stock?.percentChange >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {stock?.percentChange && stock?.percentChange >= 0 ? "+" : ""}
                      {stock?.percentChange?.toFixed(2)}%
                    </Text>
                  </View>

                  <View className="flex-row gap-3 mt-2 items-baseline">
                    <Text className="text-gray-200 font-normal text-sm">
                      {stock?.exchange === "NASDAQ NMS - GLOBAL MARKET"
                        ? "NASDAQ"
                        : stock?.exchange === "NEW YORK STOCK EXCHANGE, INC."
                          ? "NYSE"
                          : stock?.exchange}
                    </Text>

                    <Text className="text-gray-300 font-sm">
                      {"|" + "    " + stock?.currency}
                    </Text>
                  </View>
                </View>

                <View className="w-32 h-auto items-center justify-start">
                  <Image
                    source={{
                      uri: stock?.logo
                        ? stock?.logo
                        : "https://placehold.co/102x102/1a1a1a/ffffff?text=Not+Found",
                    }}
                    style={{ width: 144, height: 144, borderRadius: 24 }}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Time Interval Selector */}
              <View className="mt-6 mb-4">
                <Text className="text-white font-bold text-lg mb-3">Time Range</Text>
                <View className="flex-row flex-wrap gap-2">
                  {["1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "3Y", "5Y", "ALL"].map((interval) => (
                    <TouchableOpacity
                      key={interval}
                      onPress={() => setSelectedInterval(interval as any)}
                      className={`px-3 py-2 rounded-lg ${
                        selectedInterval === interval
                          ? "bg-accent"
                          : "bg-gray-700"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          selectedInterval === interval
                            ? "text-white"
                            : "text-gray-300"
                        }`}
                      >
                        {interval}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Chart Section */}
              {stockTimeSeriesLoading ? (
                <View className="rounded-lg bg-gray-800 p-4 m-4 items-center justify-center h-64">
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : stockTimeSeriesError ? (
                <View className="rounded-lg bg-gray-800 p-4 m-4 items-center justify-center">
                  <Text className="text-red-400">Error loading chart data</Text>
                </View>
              ) : formattedChartData && formattedChartData.labels.length > 0 ? (
                <>
                  <StockChart
                    key={selectedInterval}
                    data={formattedChartData}
                    ticker={stock?.ticker || ""}
                    currentPrice={stock?.currentPrice}
                    percentChange={stock?.percentChange}
                  />
                  
                </>
              ) : null}

              <View className="rounded-xl p-4 shadow-xl shadow-black self-center"></View>

              {/* three-column stats -> convert grid to flex-wrap */}
              <View className="flex-row flex-wrap mt-2 -mx-1">
                <StockInfo
                  label="Open"
                  value={stock?.openPriceOfTheDay?.toFixed(2)}
                />
                <StockInfo
                  label="High"
                  value={stock?.highPriceOfTheDay?.toFixed(2)}
                />
                <StockInfo
                  label="Low"
                  value={stock?.lowPriceOfTheDay?.toFixed(2)}
                />
                <StockInfo
                  label="Market Cap"
                  value={
                    stock?.marketCapitalization
                      ? stock?.marketCapitalization / 1_000_000 >= 1
                        ? (stock?.marketCapitalization / 1_000_000).toFixed(3) +
                          " T"
                        : stock?.marketCapitalization / 1_000 >= 1
                          ? (stock?.marketCapitalization / 1_000).toFixed(2) +
                            " B"
                          : stock?.marketCapitalization + " M"
                      : "N/A"
                  }
                />
                <StockInfo
                  label="Shares Outstanding"
                  value={
                    stock?.shareOutstanding
                      ? stock?.shareOutstanding / 1_000 >= 1
                        ? (stock?.shareOutstanding / 1_000).toFixed(3) + " B"
                        : stock?.shareOutstanding + " M"
                      : "N/A"
                  }
                />
                <StockInfo label="IPO" value={stock?.ipo ? stock?.ipo.split("-")[0] : "N/A"} />

                <StockInfo label="Country" value={stock?.country} />
                <StockInfo label="Industry" value={stock?.finnhubIndustry} />
                {stock?.weburl ? (
                  <Link href={stock.weburl}>
                    <StockInfo
                      label="Website"
                      value={stock.weburl}
                      numLines={2}
                      isURL={true}
                    />
                  </Link>
                ) : (
                  <StockInfo
                    label="Website"
                    value="N/A"
                    numLines={2}
                    isURL={true}
                  />
                )}
                
              </View>
            </View>
          )}
        </ScrollView>

          <TouchableOpacity 
          className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50'
          onPress={router.back}
            >
            <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor="#fff"/>
            <Text className='text-white font-semibold text-base'>Go Back</Text>
          </TouchableOpacity>

      </View>
    </>
  );
};

export default StockDetails

const styles = StyleSheet.create({});