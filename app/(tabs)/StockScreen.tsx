import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit";

import { fetchStockData, TimeSeriesData } from "@/services/fetchStockData";


const SYMBOLS = ["AAPL", "GOOG", "MSFT", "TSLA", "ZONE"];
const INTERVALS = ["1min", "5min", "15min", "30min", "60min"];
const CHART_WIDTH = Math.min(Dimensions.get("window").width - 32, 380);

const StockScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themedStyles = styles(isDark);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, interval]);

  return (
    <SafeAreaView style={themedStyles.safeArea}>
      <ScrollView contentContainerStyle={themedStyles.container}>
        <ThemedText style={themedStyles.heading}>📈 Stock Tracker</ThemedText>

        <ThemedText style={themedStyles.label}>Select Symbol:</ThemedText>
        <View style={themedStyles.pickerCard}>
          <Picker
            selectedValue={symbol}
            onValueChange={setSymbol}
            style={themedStyles.picker}
            dropdownIconColor={isDark ? "#a6e3e9" : "#3a5a40"}
            itemStyle={themedStyles.pickerItem}
          >
            {SYMBOLS.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>

        <ThemedText style={themedStyles.label}>Select Interval:</ThemedText>
        <View style={themedStyles.pickerCard}>
          <Picker
            selectedValue={interval}
            onValueChange={setInterval}
            style={themedStyles.picker}
            dropdownIconColor={isDark ? "#a6e3e9" : "#3a5a40"}
            itemStyle={themedStyles.pickerItem}
          >
            {INTERVALS.map((i) => (
              <Picker.Item key={i} label={i} value={i} />
            ))}
          </Picker>
        </View>

        {loading ? (
          <ThemedView style={themedStyles.loadingContainer}>
            <ActivityIndicator size="large" color={isDark ? "#a6e3e9" : "#3a5a40"} />
            <ThemedText style={themedStyles.loadingText}>Loading chart...</ThemedText>
          </ThemedView>
        ) : prices.length > 0 ? (
          <View style={themedStyles.chartRow}>
            <View style={themedStyles.yAxisLabelContainer}>
              <Text style={themedStyles.yAxisLabel}>Price ($)</Text>
            </View>
            <View>
              <View style={themedStyles.chartCard}>
                <LineChart
                  data={{
                    labels: labels.map((l, idx) =>
                      idx % 2 === 0 ? l : "" // Show every other label to reduce overlap
                    ),
                    datasets: [{ data: prices }],
                  }}
                  width={CHART_WIDTH}
                  height={220}
                  yAxisSuffix="$"
                  chartConfig={{
                    backgroundColor: isDark ? "#232946" : "#fff",
                    backgroundGradientFrom: isDark ? "#232946" : "#fff",
                    backgroundGradientTo: isDark ? "#181926" : "#f7f8fa",
                    decimalPlaces: 2,
                    color: (opacity = 1) =>
                      isDark
                        ? `rgba(166, 227, 233, ${opacity})`
                        : `rgba(58, 90, 64, ${opacity})`,
                    labelColor: () => (isDark ? "#b8c1ec" : "#495057"),
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: isDark ? "#a6e3e9" : "#3a5a40",
                    },
                    propsForBackgroundLines: {
                      stroke: isDark ? "#393e46" : "#e9ecef",
                    },
                  }}
                  // bezier
                  style={themedStyles.chart}
                />
              </View>
              <Text style={themedStyles.xAxisLabel}>Time</Text>
            </View>
          </View>
        ) : (
          <ThemedText style={themedStyles.noDataText}>
            No data available. Try another symbol or interval.
          </ThemedText>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockScreen;

const styles = (isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDark ? "#181926" : "#f7f8fa",
    },
    container: {
      padding: 16,
      paddingBottom: 40,
      backgroundColor: isDark ? "#181926" : "#f7f8fa",
      flexGrow: 1,
      alignItems: "center",
    },
    heading: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDark ? "#a6e3e9" : "#3a5a40",
      marginBottom: 28,
      textAlign: "center",
      marginTop: 36, // More margin for notch
    },
    label: {
      color: isDark ? "#b8c1ec" : "#495057",
      marginBottom: 4,
      fontSize: 16,
      fontWeight: "500",
      textAlign: "center",
    },
    pickerCard: {
      backgroundColor: isDark ? "#2d2e59" : "#fff",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? "#393e46" : "#e9ecef",
      marginBottom: 18,
      width: 320,
      alignSelf: "center",
      overflow: "hidden",
      justifyContent: "center",
      height: 48,
      shadowColor: isDark ? "#000" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    picker: {
      color: isDark ? "#181926" : "#232946",
      width: "100%",
      height: 48,
    },
    pickerItem: {
      fontSize: 20,
      height: 48,
      fontWeight: "500",
      color: isDark ? "#9ee1e8" : "#232946",
      textAlign: "center",
    },
    loadingContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    loadingText: {
      marginTop: 8,
      color: isDark ? "#b8c1ec" : "#495057",
    },
    noDataText: {
      color: isDark ? "#b8c1ec" : "#495057",
      textAlign: "center",
      marginTop: 24,
    },
    chartRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 24,
      marginBottom: 32,
      width: "100%",
      justifyContent: "center",
    },
    yAxisLabelContainer: {
      height: 220,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 4,
      width: 28,
    },
    yAxisLabel: {
      color: isDark ? "#b8c1ec" : "#495057",
      fontSize: 16,
      fontWeight: "600",
      transform: [{ rotate: "-90deg" }],
      textAlign: "center",
      width: 120,
    },
    chartCard: {
      backgroundColor: isDark ? "#232946" : "#fff",
      borderRadius: 20,
      padding: 8,
      shadowColor: isDark ? "#000" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      alignSelf: "center",
    },
    chart: {
      borderRadius: 16,
      backgroundColor: "transparent",
    },
    xAxisLabel: {
      textAlign: "center",
      marginTop: 8,
      color: isDark ? "#b8c1ec" : "#495057",
      fontSize: 16,
      fontWeight: "600",
    },
  });