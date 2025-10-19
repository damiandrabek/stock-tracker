import { useRouter } from "expo-router";
import React, { use, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { fetchStocksOnWatchlist } from "@/services/api";
import useFetch from "@/services/useFetch";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import StockCard from "@/components/StockCard";
import { getTrendingStocks } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";

export default function HomeScreen() {
  const router = useRouter();

  const {
    data: trendingStocks,
    loading: trendingStocksLoading,
    error: trendingStocksError,
  } = useFetch(getTrendingStocks);

  const fetchFn = useCallback(() => fetchStocksOnWatchlist(), []);
  const {
    data: stocks,
    loading: stocksLoading,
    error: stocksError,
  } = useFetch(fetchFn, true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image
          source={icons.logo}
          className="max-w-20 max-h-20 mt-20 mb-5 mx-auto"
        />

        {stocksLoading || trendingStocksLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : stocksError || trendingStocksError ? (
          <Text>
            Error:{" "}
            {stocksError
              ? stocksError.message
              : typeof trendingStocksError === "string"
              ? trendingStocksError
              : trendingStocksError instanceof Error
              ? trendingStocksError.message
              : ""}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              placeholder="Search for stocks..."
              onPress={() => router.push("/search")}
            />

            {trendingStocks && (
              <View className="mt-10">
                <Text className="text-2xl text-white font-bold mb-3">Trending Stocks</Text>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4"/>}
                  data={trendingStocks}
                  keyExtractor={(item) => item.stock_id.toString()}
                  className="bb-4 mt-3"
                  renderItem={({ item, index }) => (
                    <TrendingCard 
                      stock={item}
                      index={index}  />
                  )}
                />
              </View>
            )}

            <View>
              <Text className="text-2xl text-white font-bold mt-5 mb-3">
                Your Watchlist
              </Text>

              <FlatList
                data={stocks}
                keyExtractor={(item) => item.ticker}
                renderItem={({ item }) => <StockCard {...item} />}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = (isDark: boolean) => StyleSheet.create({});
