import React, { useEffect, useState } from 'react';

import { Text, View, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

import { Link } from 'expo-router'

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// import { fetchStockData } from '@/utils/fetchStock';

export default function HomeScreen() {

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>

      {/* <Image
        source={require("@/assets/images/app-icon.png")}
        style={styles.img}
      /> */}

      <Text
        style={styles.title}
        className="text-cyan-400 text-6xl shadow-lg font-bold"
      >
        Stocks tracked
      </Text>

      <View>
        <Link href="/StockScreen" style={styles.heading}>
          <ThemedText style={styles.heading}>Your Watchlist 🔍</ThemedText>
        </Link>

        <View style={styles.card}>
          <Text>AAPL ~ 198$</Text>
        </View>

        <View style={styles.card}>
          <Text>MSFT ~ 369$</Text>
        </View>

        <View style={styles.card}>
          <Text>AMZN ~ 173$</Text>
        </View>

        <Text className="p-2 rounded-xl border border-white bg-black text-white">
          Search
        </Text>
      </View>

      <View className="flex w-96  shadow-md">
        <ThemedText style={styles.heading}>Market News 🚨</ThemedText>

        <ThemedText>
          UnitedHealth stock is crushing down the Dow. Here's the math behind
          the slide.
        </ThemedText>

        <ThemedText>
          Apple CEO spoke with Lutnick about tariff impact on iPhone prices, WP
          says.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 44,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#eee',
    padding: 20,
    marginVertical: 5,
    boxShadow: '4px 4px rgba(0, 0, 0, 0.1)'
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginBottom: 20
  }
});