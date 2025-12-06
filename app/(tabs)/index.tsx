import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fetchStocksOnWatchlist, fetchStockTimeSeries } from "@/services/api";
import useFetch from "@/services/useFetch";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import StockCard from "@/components/StockCard";

import TrendingCard from "@/components/TrendingCard";
import { getTrendingStocks } from "@/services/appwrite";

import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user, loading, watchlist, logout, removeFromWatchlist } = useAuth();

  const {
    data: trendingStocks,
    loading: trendingStocksLoading,
    error: trendingStocksError,
  } = useFetch(getTrendingStocks);

  const fetchFn = useCallback(
    () => fetchStocksOnWatchlist(user && watchlist.length > 0 ? watchlist : undefined),
    [user?.uid, watchlist]
  );
  const {
    data: stocks,
    loading: stocksLoading,
    error: stocksError,
  } = useFetch(fetchFn, true);

  

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      {loading ? <Text>Loading...</Text> : ""}
      <View className="relative self-center h-auto p-5 mt-16 rounded-3xl bg-accent">
        {!user ? (
          <Text className="text-white">Please Log In</Text>
        ) : (
          <View className="flex-col gap-y-2">
            <View className="flex-row gap-1">
              <Image source={icons.person} />
              <Text className="text-slate-100 font-bold">{user.email}</Text>
            </View>

            <Pressable onPress={logout} className="">
              <Text className="self-center p-2 text-white font-semibold bg-red-400 rounded-full">
                Log Out
              </Text>
            </Pressable>
            {/* <FlatList
              data={watchlist}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{item}</Text>
                  <Pressable onPress={() => removeFromWatchlist(item)}>
                    <Text>Remove</Text>
                  </Pressable>
                </View>
              )}/> */}
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1 px-5 pb-40"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 16,
          flexGrow: 1,
        }}
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
          <View className="mt-5">
            <SearchBar
              placeholder="Search for stocks..."
              onPress={() => router.push("/Search")}
            />

            {trendingStocks && (
              <View className="mt-10">
                <Text className="text-2xl text-white font-bold mb-3">
                  Trending Stocks
                </Text>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  data={trendingStocks}
                  keyExtractor={(item) => item.stock_id.toString()}
                  className="bb-4 mt-3"
                  renderItem={({ item, index }) => (
                    <TrendingCard stock={item} index={index} />
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
                className="mt-2"
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
