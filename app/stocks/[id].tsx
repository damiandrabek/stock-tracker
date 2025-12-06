import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Line } from "react-native-svg";

import { StockChart } from "@/components/StockChart";
import { fetchStockDetails, fetchStockTimeSeries, type TimeRange } from "@/services/api";
import { getRawChartData, transformTimeSeriesData } from "@/services/chartUtils";
import useFetch from "@/services/useFetch";

import { icons } from "@/constants/icons";
import { useAuth } from "@/context/AuthContext";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeartOutlined from '@/components/HeartOutlined';
import HeartFilled from '@/components/HeartFilled';


interface StockInfoProps {
  label: string;
  value: string | number | null | undefined;
  isURL?: boolean;
}

const StockInfo = ({ label, value, isURL }: StockInfoProps) => {

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

  const displayValue = (() => {
    if (typeof value !== 'string') return value;
    return value
      .replace(/(^\w+:|^)\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');

  })();

  const content = (
    <View className="w-full flex-col items-start justify-center px-2 mt-4">
      <Text className="text-light-200 font-normal text-sm" numberOfLines={1}>
        {label}
      </Text>

      <Text
        className={`font-bold text-sm mt-2 ${isURL
            ? "text-accent underline"
            : "text-light-100"}
          
        `}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {displayValue || "N/A"}
      </Text>
    </View>
  );

  if (isURL && value) {
    return (
      <TouchableOpacity
        onPress={() => openUrl(value)}
        activeOpacity={0.75}
        accessibilityRole="link"
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        className="w-1/3"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View className="w-1/3">{content}</View>;
};

const StockDetails = () => {
  const insets = useSafeAreaInsets();
  

  const [selectedInterval, setSelectedInterval] = useState<TimeRange>("1M");
  const TIME_RANGES: TimeRange[] = ["1D", "1M", "3M", "6M", "YTD", "1Y", "2Y", "5Y"];
  
  const { id } = useLocalSearchParams();
  const { user, watchlist, addToWatchlist, removeFromWatchlist } = useAuth();

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

  // chartData removed - use formattedChartData below which adapts to selected interval
  const rawData = stockTimeSeries ? getRawChartData(stockTimeSeries) : [];
  const lastDataPoint = rawData.length > 0 ? rawData[rawData.length - 1] : null;

  // map selected interval to how many data points to show on the chart
  const intervalPointsMap: Record<TimeRange, number> = {
    '1D': 24,
    '1M': 30,
    '3M': 90,
    '6M': 26,
    'YTD': 52,
    '1Y': 52,
    '2Y': 104,
    '5Y': 260,
  };

  const pointsToShow = intervalPointsMap[selectedInterval] || 30;
  const formattedChartData = stockTimeSeries ? transformTimeSeriesData(stockTimeSeries, pointsToShow, selectedInterval) : null;

  const ticker = (stock?.ticker || id) as string | undefined;
  const isInWatchlist = !!ticker && watchlist?.includes(ticker);

  const handleWatchlistToggle = async () => {
    if (!ticker) return;
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(ticker);
      } else {
        await addToWatchlist(ticker);
      }
    } catch (err) {
      console.warn("Failed to update watchlist", err);
    }
  };

  return (
    <>
      <View className="bg-primary flex-1">
        <ScrollView
          className="w-full px-5"
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 16,
            flexGrow: 1,
          }}
        >
          {stockLoading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="mt-10 self-center"
            />
          ) : stockError ? (
            <Text>Error: {stockError ? stockError.message : ""}</Text>
          ) : (
            <View>
              <View className="flex-row items-start justify-between mt-24 gap-2 m-x-6">
                <View className="flex-col gap-y-[0.5] flex-1">
                    <View className="flex-col gap-1">

                      <View className="flex-row items-center gap-6">
                        <Text className="text-white font-bold text-4xl">
                          {stock?.ticker}
                        </Text>
                        {user ? (
                          <TouchableOpacity
                            onPress={handleWatchlistToggle}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            className="ml-3"
                          >
                            {isInWatchlist ? (
                              <HeartFilled size={44} color="#7B61FF" />
                            ) : (
                              <HeartOutlined size={44} color="#7B61FF" />
                            )}
                          </TouchableOpacity>
                        ) : null}
                      </View>

                      <Text className="text-gray-300 font-sm">
                        {stock?.name}
                      </Text>
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
                      {stock?.percentChange && stock?.percentChange >= 0
                        ? "+"
                        : ""}
                      {stock?.percentChange?.toFixed(2)}%
                    </Text>
                  </View>

                  <View className="flex-row gap-3 mt-2 items-baseline">
                    <Text className="text-gray-200 font-normal text-base">
                      {stock?.exchange === "NASDAQ NMS - GLOBAL MARKET"
                        ? "NASDAQ"
                        : stock?.exchange === "NEW YORK STOCK EXCHANGE, INC."
                          ? "NYSE"
                          : stock?.exchange === "LONDON STOCK EXCHANGE"
                            ? "LSE"
                            : stock?.exchange === "SWISS EXCHANGE"
                              ? "Swiss"
                              : stock?.exchange}
                    </Text>

                    <Text className="text-gray-300 font-sm">
                      {"\u2022    " + stock?.currency}
                    </Text>
                  </View>
                </View>

                <View className="items-center mr-4">
                  <Image
                    source={{
                      uri: stock?.logo
                        ? stock?.logo
                        : "https://placehold.co/102x102/1a1a1a/ffffff?text=Not+Found",
                    }}
                    style={{ width: 160, height: 160, borderRadius: 24 }}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Time Interval Selector */}
              <View className="my-4 flex-row flex-wrap gap-2">
                {TIME_RANGES.map((interval) => (
                  <TouchableOpacity
                    key={interval}
                    onPress={() => setSelectedInterval(interval as TimeRange)}
                    className={`px-3 py-3 rounded-2xl ${
                      selectedInterval === interval
                        ? "bg-accent"
                        : "bg-gray-700"
                    } ${stockTimeSeriesLoading && selectedInterval === interval ? "opacity-60" : ""}`}
                    disabled={
                      stockTimeSeriesLoading && selectedInterval === interval
                    }
                  >
                    <Text
                      className={`text-sm font-semibold ${
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

              <View className="flex-row flex-wrap -mx-1 ">
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
                  label="Number of Shares"
                  value={
                    stock?.shareOutstanding
                      ? stock?.shareOutstanding / 1_000 >= 1
                        ? (stock?.shareOutstanding / 1_000).toFixed(3) + " B"
                        : stock?.shareOutstanding + " M"
                      : "N/A"
                  }
                />
                <StockInfo
                  label="IPO"
                  value={stock?.ipo ? stock?.ipo.split("-")[0] : "N/A"}
                />

                <StockInfo label="Country" value={stock?.country} />
                <StockInfo label="Industry" value={stock?.finnhubIndustry} />
                <StockInfo
                  label="Website"
                  value={stock?.weburl || "N/A"}
                  isURL={!!stock?.weburl}
                />
              </View>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
          onPress={router.back}
        >
          <Image
            source={icons.arrow}
            className="size-5 mr-1 mt-0.5 rotate-180"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">Go Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default StockDetails

const styles = StyleSheet.create({});
