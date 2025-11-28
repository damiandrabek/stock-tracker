import { FormattedChartData } from "@/services/chartUtils";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface StockChartProps {
  data: FormattedChartData;
  ticker: string;
  currentPrice?: number;
  percentChange?: number;
}

export const StockChart: React.FC<StockChartProps> = ({
  data,
  ticker,
  currentPrice,
  percentChange,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 250;

  if (!data.labels || data.labels.length === 0) {
    return (
      <View className="rounded-lg bg-gray-800 p-4 m-4 items-center justify-center h-64">
        <Text className="text-gray-400">No data available</Text>
      </View>
    );
  }

  return (
    <View className="rounded-lg bg-gray-900 p-2 my-4 overflow-hidden">
      

      <LineChart
        data={{
          labels: data.labels,
          datasets: data.datasets,
        }}
        width={screenWidth - 64}
        height={chartHeight}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#1a1a1a",
          backgroundGradientTo: "#1a1a1a",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
          style: {
            borderRadius: 12,
          },
          propsForDots: {
            r: "2",
            strokeWidth: "2",
            stroke: "#22c55e",
          },
          propsForBackgroundLines: {
            strokeDasharray: "1",
            stroke: "rgba(156, 163, 175, 0.2)",
          },
        }}
        
        style={{
          marginVertical: 0,
          borderRadius: 12,
        }}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        withOuterLines={false}
        withShadow={true}
        fromZero={false}
      />

    </View>
  );
};

interface StockChartStatsProps {
  label: string;
  value: string;
  color?: "green" | "red" | "gray";
}

const StatItem: React.FC<StockChartStatsProps> = ({ label, value, color = "gray" }) => {
  const colorClass = {
    green: "text-green-400",
    red: "text-red-400",
    gray: "text-gray-200",
  }[color];

  return (
    <View className="flex-1 bg-gray-800 rounded-lg p-3 items-center justify-center">
      <Text className="text-gray-400 text-xs mb-1">{label}</Text>
      <Text className={`font-bold text-sm ${colorClass}`}>{value}</Text>
    </View>
  );
};

