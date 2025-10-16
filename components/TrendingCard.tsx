import { Link } from 'expo-router';
import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import MaskedView from '@react-native-masked-view/masked-view';

import { images } from "@/constants/images";


const TrendingCard = ({ stock: { stock_id, name, logo }, index }: TrendingCardProps) => {
  return (
    <Link href={`/stocks/${stock_id}`} asChild>
      <TouchableOpacity className="w-32 relative pl-5">
        <Image
          source={{
            uri: logo
              ? logo
              : "https://placehold.co/600x400/1a1a1a/ffffff?text=Not+Found",
          }}
          className="w-32 h-40 rounded-lg"
          resizeMode="cover"
        />
        <View className="absolute bottom-9 -left-2 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">{index + 1}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-14"
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        <Text
          className="text-sm font-bold mt-2 text-light-200"
          numberOfLines={2}
        >
          {name}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}


export default TrendingCard;
