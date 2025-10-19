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
    const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.equal('searchTerm', query)
    ])

    console.log(result);

    if (result.documents.length > 0) {
      const existingStock = result.documents[0];

      await databases.updateDocument(
        DATABASE_ID, 
        TABLE_ID, 
        existingStock.stock_id, 
        {
          count: existingStock.count + 1
        }
      )
    } else {
      await databases.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm: query,
        stock_id: stock.ticker,
        count: 1,
        name: stock.name,
        logo: stock.logo,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }  
}


export const getTrendingStocks = async (): Promise<TrendingStock[] | undefined> => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.limit(5),
      Query.orderDesc('count')
    ])

    return result.documents as unknown as TrendingStock[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
}