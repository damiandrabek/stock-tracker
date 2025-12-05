import { FormattedChartData } from "@/services/chartUtils";
import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface StockChartProps {
  data: FormattedChartData;
  ticker: string;
  currentPrice?: number;
  percentChange?: number;
}

export const StockChart: React.FC<StockChartProps> = ({
  data
}) => {
  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 280;
  const maxXAxisLabels = 6;
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const parentHorizontalPadding = 40; // matches px-5 (20) on each side of parent
  const fallbackWidth = screenWidth - parentHorizontalPadding;
  const chartWidth = containerWidth ?? fallbackWidth;

  const condensedLabels =
    data.labels && data.labels.length > 0
      ? data.labels.map((label, idx) => {
          const interval = Math.max(1, Math.floor(data.labels.length / maxXAxisLabels));
          const isLast = idx === data.labels.length - 1;
          return isLast || idx % interval === 0 ? label : "";
        })
      : [];

  if (!data.labels || data.labels.length === 0) {
    return (
      <View className="rounded-lg bg-gray-800 p-4 m-4 items-center justify-center h-64">
        <Text className="text-gray-400">No data available</Text>
      </View>
    );
  }

  return (
    <View
      className="rounded-lg bg-primary my-4 overflow-hidden w-full"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <LineChart
      data={{
        labels: condensedLabels,
        datasets: data.datasets,
      }}
      width={chartWidth}
      height={chartHeight}
      yAxisLabel=""
      yAxisSuffix=""
      chartConfig={{
        backgroundGradientFrom: "#1a1a1a",
        backgroundGradientTo: "#1a1a1a",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(171, 139, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
        style: {
        borderRadius: 12,
        },
        propsForDots: {
        r: "0",
        strokeWidth: "0",
        stroke: "transparent",
        },
        propsForBackgroundLines: {
        strokeDasharray: "1",
        stroke: "rgba(148, 163, 184, 0.15)",
        },
        fillShadowGradientFrom: "#8A4FFF",
        fillShadowGradientTo: "rgba(123, 97, 255, 0.01)",
        fillShadowGradientFromOpacity: 0.75,
        fillShadowGradientToOpacity: 0.1,
      }}
      style={{
        marginVertical: 0,
        paddingRight: 30,
        borderRadius: 12,
      }}
      withVerticalLabels={true}
      withHorizontalLabels={true}
      withOuterLines={false}
      withShadow={true}
      withDots={false}
      withHorizontalLines={true}
      withVerticalLines={true}
      bezier={false}
      segments={4}
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
