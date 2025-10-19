import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from "react";
import { useLocalSearchParams } from 'expo-router'

import { fetchStockDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { ID } from 'react-native-appwrite';

const StockDetails = () => {

  const { id } = useLocalSearchParams();

  const fetchFn = useCallback(() => fetchStockDetails(id.toString()), []);
  const {
    data: stock,
    loading: stockLoading,
    error: stockError,
  } = useFetch(fetchFn, true);


  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image source={{ uri: stock.logo }} />
          <Text className="text-white">{id}</Text>
          <Text className="text-white">{stock?.currentPrice.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default StockDetails

const styles = StyleSheet.create({})