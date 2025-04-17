import { Text, View, Image, StyleSheet, Platform } from 'react-native';


import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/app-icon.png")}
        style={styles.img}
      />

      <Text
        style={styles.title}
        className="text-cyan-400 text-9xl shadow-lg font-bold"
      >
        Stocks tracked
      </Text>

      <View>
        <ThemedText style={styles.heading}>Your Watchlist 🔍</ThemedText>

        <View style={styles.card}>
          <Text>AAPL ~ 198$</Text>
        </View>
        <View style={styles.card}>
          <Text>MSFT ~ 369$</Text>
        </View>
        <View style={styles.card}>
          <Text>AMZN ~ 173$</Text>
        </View>

        <View className="flex w-96  shadow-md ">
          <ThemedText style={styles.heading}>Market News 🚨</ThemedText>
          <ThemedText>
            UnitedHealth stock is crushing down the Dow. Here's the math behind
            the slide.
          </ThemedText>
          <ThemedText>
            Apple CEO spoke with Lutnick about tariff impact on iPhone prices,
            WP says.
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
