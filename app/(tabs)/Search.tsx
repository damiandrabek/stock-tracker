import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

import StockCard from "@/components/StockCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import { fetchStocksForLookUp } from "@/services/api";
import useFetch from "@/services/useFetch";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: stocks,
    loading: stocksLoading,
    error: stocksError,
    refetch: loadSearchStocks,
    reset,
  } = useFetch(
    () =>
      fetchStocksForLookUp({
        query: searchQuery,
      }),
    false
  );

  // Debounce search
  useEffect(() => {
    const timeoutID = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadSearchStocks();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutID);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={stocks}
        keyExtractor={(item) => item.ticker}
        renderItem={({ item }) =>
          item.noAccess ? <StockCard {...item} /> : <StockCard {...item} />
        }
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
          paddingRight: 5,
          marginBottom: 10,
        }}
        className="mt-2 px-5"
        scrollEnabled={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="max-w-20 max-h-20" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for stocks..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {stocksLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {stocksError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {stocksError.message}
              </Text>
            )}

            {!stocksLoading &&
              !stocksError &&
              searchQuery.trim() &&
              (stocks?.length ?? 0) > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !stocksLoading && !stocksError ? (
            <View className="mt-10 px-5 ">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No stocks found."
                  : "Start typing to search for stocks."}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
