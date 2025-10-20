import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
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
        <View>
          <Image 
            source={{ uri: stock?.logo 
              ? stock?.logo 
              : "https://placehold.co/600x400/1a1a1a/ffffff?text=Not+Found",
            }}
            className='w-12 h-[120px]'
            resizeMode='stretch' />
          
        </View>

        <View className="flex-col items-start mt-5 px-5">
          <Text className="text-white font-bold text-xl">{stock?.ticker}</Text>

          <View className='flex-row items-center gap-x-1 mt-2'>
            <Text className='text-light 200 font-sm'>${stock?.name}</Text>
            <Text className='text-light 200 font-sm'>${stock?.currentPrice}</Text>

          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default StockDetails