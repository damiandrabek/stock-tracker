import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const StockDetails = () => {

  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Stock Details: {id}</Text>
    </View>
  )
}

export default StockDetails

const styles = StyleSheet.create({})