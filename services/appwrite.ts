// track the searches made by users
import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)


const databases = new Databases(client);

export const updateSearchCount = async (query: string, stock: Stock) => {

  try {
    // Normalize ticker to avoid duplicates (e.g. 'AAPL' vs 'aapl')
    const normalizedTicker = (stock.ticker || '').toUpperCase();

    // First try to find an existing document for this ticker
    let result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.equal('stock_id', normalizedTicker),
      Query.limit(1),
    ]);

    if (result.documents.length > 0) {
      const existingStock = result.documents[0];

      // increment the count and optionally append this search term if new
      const updatedSearchTerms = Array.isArray(existingStock.searchTerms)
        ? Array.from(new Set([...existingStock.searchTerms, query]))
        : [query];

      await databases.updateDocument(
        DATABASE_ID,
        TABLE_ID,
        existingStock.$id,
        {
          count: (existingStock.count || 0) + 1,
          searchTerm: query,
          searchTerms: updatedSearchTerms,
          name: stock.name || existingStock.name,
          logo: stock.logo || existingStock.logo,
        }
      );
      return;
    }

    // If no document exists for this ticker, check if the exact searchTerm exists
    result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.equal('searchTerm', query),
      Query.limit(1),
    ]);

    if (result.documents.length > 0) {
      // If a doc exists for this search term, associate it with the normalized ticker
      const existingStock = result.documents[0];
      await databases.updateDocument(DATABASE_ID, TABLE_ID, existingStock.$id, {
        count: (existingStock.count || 0) + 1,
        stock_id: normalizedTicker,
        searchTerms: Array.from(new Set([...(existingStock.searchTerms || []), query])),
        name: stock.name || existingStock.name,
        logo: stock.logo || existingStock.logo,
      });
      return;
    }

    // Create new document keyed by normalized ticker
    await databases.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
      searchTerm: query,
      searchTerms: [query],
      stock_id: normalizedTicker,
      count: 1,
      name: stock.name,
      logo: stock.logo,
    });
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }  
}


export const getTrendingStocks = async (): Promise<TrendingStock[] | undefined> => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.limit(10),
      Query.orderDesc('count')
    ])

    return result.documents as unknown as TrendingStock[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
}