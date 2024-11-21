import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, NativeModules } from 'react-native';
import { multiply, getAddress, route } from 'react-native-yttrium';

export default function App() {
  const [result, setResult] = useState<number | undefined>();

  useEffect(() => {
    multiply(3, 7).then(setResult);
    console.log(
      'Native Modules',
      NativeModules.Yttrium,
      route().then(console.log)
    );
  }, []);

  getAddress().then(console.log);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
