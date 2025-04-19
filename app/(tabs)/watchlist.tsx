import { StyleSheet, Text, View } from 'react-native'

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";


const watchlist = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Watchlist</ThemedText>
    </ThemedView>
  )
}

export default watchlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});