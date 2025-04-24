import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { fetchStockData } from '@/services/fetchStock';

const screenWidth = Dimensions.get('window').width;

export default function StockScreen() {
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getStock = async () => {
      const data = await fetchStockData('AAPL');

      if (data && data['Time Series (5min)']) {
        const times = Object.keys(data['Time Series (5min)']).slice(0, 10).reverse(); // latest 10 entries
        const values = times.map((time) =>
          parseFloat(data['Time Series (5min)']![time]['1. open'])
        );

        setLabels(times.map((time) => time.split(' ')[1])); // only time part
        setPrices(values);
      }

      setLoading(false);
    };

    getStock();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text>Loading chart...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4">
      <Text className="text-xl font-bold mb-4">AAPL Intraday (5min) Prices</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: prices }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix="$"
        chartConfig={{
          backgroundColor: '#1c1c1e',
          backgroundGradientFrom: '#1c1c1e',
          backgroundGradientTo: '#333',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 230, 118, ${opacity})`,
          labelColor: () => '#ffffff',
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    </ScrollView>
  );
}
