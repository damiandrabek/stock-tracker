import { fetchStockData } from '@/services/fetchStockData';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';


export const Search = () => {
  // const [symbol, setSymbol] = useState('');
  // const [result, setResult] = useState<{ price: string; time: string } | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // const handleSearch = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setResult(null);
  //   try {
  //     const data = await fetchStockData(symbol.trim().toUpperCase(), '5min');
  //     if (!data) {
  //       setError('API limit reached or error. Please try again later.');
  //     } else {
  //       const timeSeries = data['Time Series (5min)'];
  //       if (timeSeries) {
  //         const latestTime = Object.keys(timeSeries)[0];
  //         const latestPrice = timeSeries[latestTime]['1. open'];
  //         setResult({ price: latestPrice, time: latestTime });
  //       } else {
  //         setError('Symbol not found or no data available.');
  //       }
  //     }
  //   } catch (e) {
  //     setError('Network error.');
  //   }
  //   setLoading(false);
  // };

  // const handleRefresh = () => {
  //   if (symbol) handleSearch();
  // };

  return (
    <Text>Search for a stock</Text>
    // <View className="flex-1 bg-primary px-4 pt-10">
    //   <Text className="text-3xl font-bold text-center mb-6 text-blue-400">Search Stocks</Text>
    //   <View className="flex-row items-center mb-4">
    //     <TextInput
    //       className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-lg text-gray-900 dark:text-gray-100"
    //       placeholder="Enter symbol (e.g. AAPL)"
    //       placeholderTextColor="#94a3b8"
    //       value={symbol}
    //       onChangeText={setSymbol}
    //       autoCapitalize="characters"
    //     />
    //     <Pressable
    //       className="ml-2 bg-blue-500 rounded-lg px-4 py-2"
    //       onPress={handleSearch}
    //     >
    //       <Text className="text-white font-semibold text-lg">Search</Text>
    //     </Pressable>
    //   </View>
    //   {loading && (
    //     <ActivityIndicator size="large" color="#3a86ff" className="mt-6" />
    //   )}
    //   {error && (
    //     <Text className="text-red-500 text-center mt-4">{error}</Text>
    //   )}
    //   {result && (
    //     <View className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-6 items-center">
    //       <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{symbol.toUpperCase()}</Text>
    //       <Text className="text-2xl text-blue-500 font-semibold mb-1">${result.price}</Text>
    //       <Text className="text-gray-500 dark:text-gray-400 mb-3">Last updated: {result.time}</Text>
    //       <Pressable
    //         className="bg-blue-500 rounded-lg px-4 py-2 mt-2"
    //         onPress={handleRefresh}
    //       >
    //         <Text className="text-white font-semibold text-lg">Refresh</Text>
    //       </Pressable>
    //     </View>
    //   )}
    // </View>
  );
};

export default Search;
