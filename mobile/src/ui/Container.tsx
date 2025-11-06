import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import type { ContainerProps } from '@shared/types';

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  style,
  className 
}) => {
  const containerStyle: ViewStyle = {
    ...styles.container,
    ...(style as ViewStyle),
  };

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
});

