import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native";

import { fetchStocksOnWatchlist } from "@/services/api";
import useFetch from "@/services/useFetch";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SeachBar";
import StockCard from "@/components/StockCard";


export default function HomeScreen() {
  const router = useRouter();

  const fetchFn = useCallback(() => fetchStocksOnWatchlist(), []);

  const { data: stocks, loading: stocksLoading, error: stocksError,
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
         

         {stocksLoading ? (
            <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mt-10 self-center"
            />
         ) : stocksError ? (
            <Text>
              Error: {stocksError?.message}
            </Text>
         ) :(
            <View className="flex-1 mt-5">
              <SearchBar
                onPress={() => router.push('/search')}
                placeholder="Search for a stock"
              />

              <>
                <Text className="text-lg text-white font-bold mt-5 mb-3">
                  Your Watchlist
                </Text>

                {Array.isArray(stocks) && (
                  <FlatList
                    data={stocks}
                    keyExtractor={item => item.ticker}
                    renderItem={({ item }) => (
                      <StockCard
                        {...item}
                      />
                    )}
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
                )}
              </>
            </View>
         )}
         </ScrollView>
    </View> 
  )
}

const styles = (isDark: boolean) =>
  StyleSheet.create({});
