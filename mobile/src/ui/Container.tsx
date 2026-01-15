import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import type { ContainerProps } from '@shared/types';

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  className,
}) => {
  const containerStyle: ViewStyle = {
    ...styles.container,
    ...(style as ViewStyle),
  };

  return <View className={className}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
});

