import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, NativeModules } from 'react-native';
import { route, status } from 'react-native-yttrium';

const tx = {
  data: '0xa9059cbb000000000000000000000000228311b83daf3fc9a0d0a46c0b329942fc8cb2ed00000000000000000000000000000000000000000000000000000000002dc6c0',
  from: '0x13A2Ff792037AA2cd77fE1f4B522921ac59a9C52',
  to: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
  value: '0',
  gas: '0',
  gasPrice: '0',
  nonce: '1',
  maxFeePerGas: '0',
  maxPriorityFeePerGas: '0',
  chainId: 'eip155:10',
};
export default function App() {
  const [result, setResult] = useState<string | undefined>();

  useEffect(() => {
    console.log('Native Modules', NativeModules.Yttrium);

    // setTimeout(async () => {
    //   console.log('requesting status');
    //   status({
    //     orchestrationId: 'e7225838-5211-4851-85a2-cd596e68d628',
    //     projectId: '942cb705fcbddae9f61bc75f7fa14855',
    //   }).then(console.log);
    // }, 1000);
    // return;
    setTimeout(async () => {
      console.log('requesting route');
      const res = await route({
        transaction: tx,
        projectId: '942cb705fcbddae9f61bc75f7fa14855',
      });
      console.log(JSON.stringify(res, null, 2));
    }, 1000);
  }, []);

  // const checkRoute = () => {
  //   fetch(
  //     `https://rpc.walletconnect.org/v1/ca/orchestrator/route?projectId=942cb705fcbddae9f61bc75f7fa14855`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         transaction: tx,
  //       }),
  //     }
  //   )
  //     .then(async (res) => {
  //       console.log('result OK:', res.ok);
  //       console.log('result body', await res.json());
  //     })
  //     .catch((err) => {
  //       console.log('err', err);
  //     });
  // };
  // getAddress().then(console.log);

  return (
    <View style={styles.container}>
      <Text>Result: test</Text>
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
