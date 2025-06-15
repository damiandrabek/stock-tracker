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
  View,
} from "react-native";

import { images } from "@/constants/images";

import { fetchStocks } from "@/services/fetchStocks";
import useFetch from "@/services/useFetch";

export default function HomeScreen() {
  const router = useRouter();

  // Wrap fetch function in useCallback to prevent infinite loop
  const fetchStocksCallback = useCallback(() => fetchStocks({ query: "" }), []);

  const {
    data: stocks,
    loading: stocksLoading,
    error: stocksError,
  } = useFetch(fetchStocksCallback, true);
  // const {
  //   data: stocks,
  //   loading: stocksLoading,
  //   error: stocksError,
  // } = useFetch(() =>
  //   fetchStocks({
  //     query: "",
  //   })
  // );

  console.log(stocks);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const themedStyles = styles(isDark);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        {/* <Image
          source={icons.logo}
          className="max-w-12 max-h-10 mt-20 mb-5 mx-auto"
        /> */}

        {stocksLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : stocksError ? (
          <Text>Error: {stocksError.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            {/* <SeachBar
              onPress={() => router.push("/search")}
              placeholder="Search for a stock..."
            /> */}

            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Popular Stocks
              </Text>

              <FlatList
                data={stocks}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Text className="text-white text-sm">{item}</Text>
                )}
              />
            </>
          </View>
        )}

        {/* <Text style={themedStyles.title}>Stocks tracked</Text>

        <View>
          <Link href="/StockScreen" style={themedStyles.heading}>
            <ThemedText style={themedStyles.heading}>
              Your Watchlist 🔍
            </ThemedText>
          </Link>

          <Link href="/stock/apple">
            <View style={themedStyles.card}>
              <Text style={themedStyles.cardText}>AAPL ~ 198$</Text>
            </View>
          </Link>

          <Link href="/stock/microsoft">
            <View style={themedStyles.card}>
              <Text style={themedStyles.cardText}>MSFT ~ 369$</Text>
            </View>
          </Link>

          <Link href="/stock/amazon">
            <View style={themedStyles.card}>
              <Text style={themedStyles.cardText}>AMZN ~ 173$</Text>
            </View>
          </Link>

          <Pressable
            style={themedStyles.searchButton}
            onPress={() => alert("Search button pressed")}
          >
            <Text style={themedStyles.searchButtonText}>Search</Text>
          </Pressable>
        </View>

        <View style={themedStyles.divider} />

        <View>
          <ThemedText style={themedStyles.heading}>Market News 🚨</ThemedText>
          <ThemedText style={themedStyles.newsText}>
            UnitedHealth stock is crushing down the Dow. Here's the math behind
            the slide.
          </ThemedText>
          <ThemedText style={themedStyles.newsText}>
            Apple CEO spoke with Lutnick about tariff impact on iPhone prices,
            WP says.
          </ThemedText>
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = (isDark: boolean) =>
  StyleSheet.create({
    title: {
      fontWeight: "bold",
      fontSize: 44,
      color: isDark ? "#f7f7fa" : "#22223b",
      marginBottom: 8,
      letterSpacing: 1,
      textAlign: "center",
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 20,
      textAlign: "center",
      color: isDark ? "#a6e3e9" : "#3a5a40",
    },
    card: {
      backgroundColor: isDark ? "#232946" : "#fff",
      padding: 22,
      marginVertical: 8,
      borderRadius: 18,
      shadowColor: isDark ? "#000" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      width: 320,
      alignSelf: "center",
      borderWidth: 1,
      borderColor: isDark ? "#393e46" : "#e9ecef",
    },
    cardText: {
      color: isDark ? "#f7f7fa" : "#232946",
      fontSize: 18,
      fontWeight: "500",
    },
    img: {
      width: 140,
      height: 140,
      borderRadius: 32,
      marginBottom: 18,
      alignSelf: "center",
      borderWidth: 2,
      borderColor: isDark ? "#393e46" : "#e9ecef",
    },
    searchButton: {
      backgroundColor: isDark ? "#3a86ff" : "#3a86ff",
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 24,
      marginTop: 18,
      alignSelf: "center",
      shadowColor: "#3a86ff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 2,
    },
    searchButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 18,
      letterSpacing: 0.5,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "#393e46" : "#e9ecef",
      width: "80%",
      marginVertical: 28,
      alignSelf: "center",
      borderRadius: 1,
    },
    newsText: {
      fontSize: 16,
      color: isDark ? "#b8c1ec" : "#495057",
      marginBottom: 10,
      textAlign: "center",
      lineHeight: 22,
    },
  });
