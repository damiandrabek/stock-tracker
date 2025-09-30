import { Tabs } from 'expo-router';
import React from 'react';

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";


import { View, Text, Image, ImageBackground, Platform } from 'react-native';

import { AuthProvider } from '@/context/AuthContext';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const TabIcon = ({focused, icon, title}: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor="#151312" className="size-5" />

        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  } 

  return (
    <View className='size-full justify-center items-center mt-4 rounded-full'>
      <Image
        source={icon}
        tintColor="#A8B5DB"
        className='size-5'/>
    </View>
  )
  

}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // <AuthProvider>

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: '#0f0D23',
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#0f0D23',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} icon={icons.home} title="Home" />
            </>
          ),
        }}
      />

      <Tabs.Screen
        name="Search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} icon={icons.search} title="Search" />
            </>
          ),
        }}
      />


      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} icon={icons.person} title="Profile" />
            </>
          ),
        }}
      />

      <Tabs.Screen
        name="StockScreen"
        options={{
          title: "Stocks",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} icon={icons.home} title="Stocks" />
            </>
          ),
        }}
      />
    </Tabs>

    // </AuthProvider>
  );
}
