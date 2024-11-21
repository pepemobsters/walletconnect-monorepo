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
export function multiply(a: number, b: number): Promise<number> {
  // return Yttrium.demof(a, b);
  return new Promise((resolve, reject) => {});
}

export function route(): Promise<void> {
  return Yttrium.Endpoint();
}

export function getAddress(): Promise<string> {
  return Yttrium.Address();
}
