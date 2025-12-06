import { Link } from 'expo-router';
import * as React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import MaskedView from '@react-native-masked-view/masked-view';

import { images } from "@/constants/images";

const BADGE_SIZE = 64;


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
        <View style={styles.badgeContainer}>
          <MaskedView
            style={styles.maskedView}
            maskElement={
              <View style={styles.badgeMask}>
                <Text style={styles.shadowText}>{index + 1}</Text>
              </View>
            }
          >
            <Image
              source={images.rankingGradient}
              style={styles.badgeImage}
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

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    bottom: 36, // matches tailwind bottom-9
    left: -8,
  },
  maskedView: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
  },
  badgeMask: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeImage: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
  },
  shadowText: {
    color: 'rgba(0,0,0,0.95)',
    fontWeight: '800',
    fontSize: 44,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
