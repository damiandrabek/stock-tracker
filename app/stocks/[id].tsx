import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from "react";
import { useLocalSearchParams } from 'expo-router'

import { fetchStockDetails } from "@/services/api";
import useFetch from "@/services/useFetch";

const StockDetails = () => {

  const { id } = useLocalSearchParams();

  const fetchFn = useCallback(() => fetchStockDetails(id as string), []);
  const {
    data: stock,
    loading: stockLoading,
    error: stockError,
  } = useFetch<Stock>(fetchFn, true);


  return (
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
          <View className="w-full">
            <Image
              source={{
                uri: stock?.logo
                  ? stock?.logo
                  : "https://placehold.co/302x302/1a1a1a/ffffff?text=Not+Found",
              }}
              className=" mx-16 mt-4 h-auto aspect-[1/1] rounded-3xl"
              resizeMode="stretch"
            />

            <View className="grid grid-cols-2 gap-y-3 mt-5">
              <View className="items-center gap-x-10 mt-2">
                <Text className="text-white font-bold text-xl">
                  {stock?.ticker}
                </Text>
                <Text className="text-light-100 font-md">{stock?.name}</Text>
              </View>

              <View className="items-center justify-stretch gap-x-10 mt-2 ">
                <Text className="text-white font-bold text-xl">
                  {stock?.currentPrice.toFixed(2)}
                </Text>
                <Text className="text-green-400 font-sm">
                  {stock?.percentChange.toFixed(2)}%
                </Text>
              </View>
            </View>

            <View className="grid grid-cols-2 gap-y-3 mt-5">
              <View className="items-center">
                <View className="flex-row justify-between w-full px-10">
                  <Text className="text-white">Open</Text>
                  <Text className="text-white">
                    {stock?.openPriceOfTheDay.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between w-full px-10">
                  <Text className="text-white">High</Text>
                  <Text className="text-white">
                    {stock?.highPriceOfTheDay.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between w-full px-10">
                  <Text className="text-white">Low</Text>
                  <Text className="text-white">
                    {stock?.lowPriceOfTheDay.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between w-full px-10">
                  <Text className="text-white">IPO</Text>
                  <Text className="text-white">
                    {stock?.ipo}
                  </Text>
                </View>
              </View>

              <View className="items-center">
                <View className="flex-row justify-between w-full px-10">
                  <Text className="text-white">Mkt Cap</Text>
                  <Text className="text-white">
                    {(stock?.marketCapitalization / 1_000).toFixed(2)} B
                  </Text>
                </View>
                <View className="flex-row justify-between w-full px-10">
                  <Text className="text-white">Exchange</Text>
                  <Text className="text-white">
                    {stock?.exchange}
                  </Text>
                </View>
                <View className="flex-row justify-between w-full px-10">
                  <Text className="text-white">Industry</Text>
                  <Text className="text-white">
                    {stock?.finnhubIndustry}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default StockDetails