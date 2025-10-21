// services/watchlist.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const WATCHLIST_KEY = "watchlist_v1";

export async function getWatchlist(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addToWatchlist(symbol: string) {
  const list = await getWatchlist();
  if (!list.includes(symbol)) {
    list.unshift(symbol);
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  }
}

export async function removeFromWatchlist(symbol: string) {
  const list = (await getWatchlist()).filter((s) => s !== symbol);
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}
