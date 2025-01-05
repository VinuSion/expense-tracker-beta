import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator style={styles.loader} size="large" color="#fff" />
      <Text style={styles.title}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#25292e",
  },
  title: {
    fontSize: 24,
    fontWeight: 900,
    color: "#fff"
  },
  loader: {
    height: 70,
    width: 70,
  }
});

export default LoadingScreen;