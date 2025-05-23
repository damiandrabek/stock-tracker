import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";


import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";
import { fetchStockData, TimeSeriesData } from "@/utils/fetchStock";

const screenWidth = Dimensions.get("window").width;

const SYMBOLS = ["AAPL", "GOOG", "MSFT", "TSLA", "ZONE"];
const INTERVALS = ["1min", "5min", "15min", "30min", "60min"];

const StockScreen = () => {
  const [symbol, setSymbol] = useState<string>("AAPL");
  const [interval, setInterval] = useState<string>("5min");
  const [labels, setLabels] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadStockData = async () => {
    setLoading(true);
    const data = await fetchStockData(symbol, interval);
    const key = `Time Series (${interval})` as keyof typeof data;

    if (data && data[key]) {
      const timeSeries: TimeSeriesData = data[key]!;
      const times = Object.keys(timeSeries).slice(0, 10).reverse();
      const values = times.map((time) =>
        parseFloat(timeSeries[time]["1. open"])
      );

      setLabels(times.map((t) => t.split(" ")[1] ?? t));
      setPrices(values);
    } else {
      setLabels([]);
      setPrices([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadStockData();
  }, [symbol, interval]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.heading}>📈 Stock Tracker</ThemedText>

      <ThemedText style={styles.label}>Select Symbol:</ThemedText>
      <Picker
        selectedValue={symbol}
        onValueChange={setSymbol}
        style={styles.picker}
      >
        {SYMBOLS.map((s) => (
          <Picker.Item key={s} label={s} value={s} />
        ))}
      </Picker>

      <ThemedText style={styles.label}>Select Interval:</ThemedText>
      <Picker
        selectedValue={interval}
        onValueChange={setInterval}
        style={styles.picker}
      >
        {INTERVALS.map((i) => (
          <Picker.Item key={i} label={i} value={i} />
        ))}
      </Picker>

      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00e676" />
          <ThemedText style={styles.loadingText}>Loading chart...</ThemedText>
        </ThemedView>
      ) : prices.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data: prices }],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisSuffix="$"
          chartConfig={{
            backgroundColor: "#1c1c1e",
            backgroundGradientFrom: "#1c1c1e",
            backgroundGradientTo: "#333",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 230, 118, ${opacity})`,
            labelColor: () => "#ffffff",
            style: {
              borderRadius: 16,
            },
          }}
          //bezier
          style={{ borderRadius: 16 }}
        />
      ) : (
        <ThemedText style={styles.noDataText}>
          No data available. Try another symbol or interval.
        </ThemedText>
      )}
    </ScrollView>
  );
};

export default StockScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#000",
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  label: {
    color: "white",
    marginBottom: 4,
  },
  picker: {
    color: "white",
    backgroundColor: "#333",
    marginBottom: 16,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "white",
  },
  noDataText: {
    color: "white",
    textAlign: "center",
    marginTop: 24,
  },
});