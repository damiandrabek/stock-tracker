import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { fetchStockDetails } from "@/services/api";
import useFetch from "@/services/useFetch";

import { icons } from "@/constants/icons";

interface StockInfoProps {
  label: string;
  value: string | number | null | undefined;
  numLines?: number;
  isURL?: boolean;
}

const StockInfo = ({ label, value, numLines, isURL }: StockInfoProps) => (
  <View className="w-1/3 flex-col items-start justify-center mt-5 px-1">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text
      className="text-light-100 font-bold text-sm mt-2"
      numberOfLines={numLines || 2}
    >
      {isURL 
      ? value?.toString().replace(/(^\w+:|^)\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "")
      : value || "N/A"}
    </Text>
  </View>
);

const StockDetails = () => {

  
  const { id } = useLocalSearchParams();

  const fetchFnDetails = useCallback(() => fetchStockDetails(id as string), []);
  const {
    data: stock,
    loading: stockLoading,
    error: stockError,
  } = useFetch<Stock>(fetchFnDetails, true);

  // const [timeInterval, setTimeInterval] = useState<string>('5min');
  // const fetchFn2 = useCallback(() => fetchStockTimeSeries(id as string, timeInterval as string), []);
  // const {
  //   data: stockTimeSeries,
  //   loading: stockTimeSeriesLoading,
  //   error: stockTimeSeriesError,
  // } = useFetch<StockTimeSeries>(fetchFn2, true);


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
            <View className="w-full px-8">
              {/* two-column layout -> convert grid to flex-row */}
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

                <View className="w-28 items-center justify-start">
                  <Image
                    source={{
                      uri: stock?.logo
                        ? stock?.logo
                        : "https://placehold.co/102x102/1a1a1a/ffffff?text=Not+Found",
                    }}
                    style={{ width: 102, height: 102, borderRadius: 24 }}
                    resizeMode="cover"
                  />
                </View>
              </View>

              <View className="rounded-xl p-4 shadow-xl shadow-black self-center"></View>

              {/* three-column stats -> convert grid to flex-wrap */}
              <View className="flex-row flex-wrap mt-5 -mx-1">
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
                <StockInfo
                  label="Website"
                  value={stock?.weburl}
                  numLines={2}
                  isURL={true}
                />
              </View>

              {/* <View>{stockTimeSeries}</View> */}
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