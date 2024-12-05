import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-yttrium' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Yttrium = NativeModules.Yttrium
  ? NativeModules.Yttrium
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
console.log('react-native-yttrium loaded', NativeModules.Yttrium);

type RoutePrams = {
  projectId: string;
  transaction: {
    value: string;
    chainId: string;
    from: string;
    to: string;
  };
};

export function route(params: RoutePrams): Promise<any> {
  return Yttrium.checkRoute(params);
}

type StatusParams = {
  orchestrationId: string;
  projectId: string;
};
export function status(params: StatusParams): Promise<string> {
  return NativeModules.Yttrium.checkStatus(params);
}

// {
//   "orchestrationId": "824fe40d-65c2-4f1b-9e35-90d04a755fe7",
//   "checkIn": 3000,
//   "metadata": {
//     "fundingFrom": [
//       {
//         "tokenContract": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
//         "amount": "0xf909c",
//         "chainId": "eip155:42161",
//         "symbol": "USDC"
//       }
//     ]
//   },
//   "transactions": [
//     {
//       "gas": "1023618",
//       "data": "0x095ea7b30000000000000000000000003a23f943181408eac424116af7b7790c94cb97a500000000000000000000000000000000000000000000000000000000000fe655",
//       "nonce": "0",
//       "gasPrice": "10000000",
//       "value": "0",
//       "from": "0x13A2Ff792037AA2cd77fE1f4B522921ac59a9C52",
//       "chainId": "eip155:42161",
//       "to": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
//       "maxFeePerGas": "0",
//       "maxPriorityFeePerGas": "0"
//     },
//     {
//       "maxFeePerGas": "0",
//       "value": "0",
//       "from": "0x13A2Ff792037AA2cd77fE1f4B522921ac59a9C52",
//       "gasPrice": "10000000",
//       "data": "0x0000019f792ebcb900000000000000000000000000000000000000000000000000000000000fe655000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000055b90000000000000000000000000000000000000000000000000000000000001b3b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000013a2ff792037aa2cd77fe1f4b522921ac59a9c5200000000000000000000000013a2ff792037aa2cd77fe1f4b522921ac59a9c520000000000000000000000000000000000000000000000000000000000000002000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e58310000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000f909c000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000067502bf70000000000000000000000000000000000000000000000000000000067507ffdd00dfeeddeadbeef765753be7f7a64d5509974b0d678e1e3149b02f4",
//       "nonce": "1",
//       "maxPriorityFeePerGas": "0",
//       "gas": "1023618",
//       "to": "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
//       "chainId": "eip155:42161"
//     }
//   ]
// }
