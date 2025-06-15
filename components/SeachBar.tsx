import React from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';

import { icons } from '@/constants/icons';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const SeachBar = ({ placeholder, value, onChangeText }: Props) => {
  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
      <Image source={icons.search} className="size-5" resizeMode='contain' tintColor="#ab8bff"/>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor='#A8B5DB'
        value={value}
        onChangeText={onChangeText}
        className='flex-1 ml-2 text-white'/>
    </View>
  )
}

export default SeachBar

const styles = StyleSheet.create({})