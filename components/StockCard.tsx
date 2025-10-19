import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

const StockCard = ({
  ticker,
  name,
  logo,
  ipo,
  country,
  currency,
  exchange,
  marketCapitalization,
  weburl,
  finnhubIndustry,
  currentPrice,
  change,
  percentChange,
  highPriceOfTheDay,
  lowPriceOfTheDay,
  openPriceOfTheDay,
  previousClosePrice,
}: Stock) => {
  return (
    <Link href={`/stocks/${ticker}`} asChild>
      <TouchableOpacity className="w-[30%] mb-8">
        <Image
          source={{
            uri: logo
              ? logo
              : "https://placehold.co/600x400/1a1a1a/ffffff?text=Not+Found",
          }}
          className="w-full h-32 rounded-lg"
          resizeMode="cover"
        />

        <Text className="text-sm  font-bold text-white mt-2">
          {ticker}{" "}
          <Text className="text-green-400">
            ${currentPrice ? currentPrice.toFixed(2) : "N/A"}
          </Text>
        </Text>
        <Text className="text-xs text-white" numberOfLines={1}>
          {name ? name : ""}
        </Text>

        {/* <View className='flex-row items0center justify-start gap-x-1'>
            <Image source={require('../assets/icons/star.png')} />
        </View> */}

        {/* <Text className='text-xs font-medium text-light-300 uppercase'>
          {finnhubIndustry}
        </Text> */}
      </TouchableOpacity>
    </Link>
  );
};


export default StockCard;
