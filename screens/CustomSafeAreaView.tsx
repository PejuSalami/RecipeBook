import React from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export type CustomSafeAreaView = {
  children: React.ReactNode;
};

export const CustomSafeAreaView = ({ children }: CustomSafeAreaView) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return <SafeAreaView style={backgroundStyle}>{children}</SafeAreaView>;
};
