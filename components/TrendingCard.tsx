import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import MaskedView from '@react-native-masked-view/masked-view';
import { images } from "@/constants/images";


const TrendingCard = ({ stock: { stock_id, name, logo }, index }: TrendingCardProps) => {
  return (
    <Link href={`/stocks/${stock_id}`} asChild>
      <TouchableOpacity className='w-32 relative pl-5'>
        <Image
          source={{
            uri: logo ? logo : "https://placehold.co/600x400/1a1a1a/ffffff?text=Not+Found",
          }}
          className='w-32 h-48 rounded-lg'
          resizeMode='cover'
          style={{ width: 180, height: 180, borderRadius: 12 }}
        />
        <View className='absolute bottom-9 -left-3.5 px-2 py-1 rounded-full'>
          <MaskedView 
            maskElement={
              <Text className='font-bold text-white text-6xl'>{index+1}</Text>
            }>

            <Image
              source={images.rankingGradient}
              className='size-14'
              resizeMode='cover'
            />
          </MaskedView>

          {/* <Text className="text-white text-sm">
            {name}
          </Text> */}
        </View>
      </TouchableOpacity>

      
    </Link>
  );
}


export default TrendingCard;
