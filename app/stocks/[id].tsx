import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const StockDetails = () => {

  const { id } = useLocalSearchParams();

  return (
    <View className='bg-primary flex-1'>
      
      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        <View>
          <Image source={{ uri: logo}}/>
        </View>
      </ScrollView>

    </View>
  )
}

export default StockDetails

const styles = StyleSheet.create({})