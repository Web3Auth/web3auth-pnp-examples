/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, { useCallback, useEffect, useMemo, useState, PropsWithChildren } from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as ec from '@toruslabs/eccrypto';

import { ShareSerializationModule } from '@tkey/share-serialization';
import SecurityQuestionsModule from '@tkey/security-questions';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import BN from 'bn.js';
import CustomAuth from '@toruslabs/customauth-react-native-sdk';
import ThresholdKey from '@tkey/default';
import TorusServiceProvider from '@tkey/service-provider-base';
import TorusStorageLayer from '@tkey/storage-layer-torus';
import { ShareTransferModule } from '@tkey/share-transfer';
import { generatePrivateExcludingIndexes } from '@tkey/common-types';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const GOOGLE = 'google';
const verifierMap = {
  [GOOGLE]: {
    name: 'Google',
    typeOfLogin: 'google',
    clientId: '759944447575-6rm643ia1i9ngmnme3eq5viiep5rp6s0.apps.googleusercontent.com',
    verifier: 'sk-react-native-test',
  },
};

const directParams = {
  baseUrl: `http://localhost:3000/serviceworker/`,
  enableLogging: true,
  network: 'celeste',
};
const serviceProvider = new TorusServiceProvider({
  customAuthArgs: directParams,
} as any);
const storageLayer = new TorusStorageLayer({
  hostUrl: 'https://metadata.tor.us',
});
const shareTransferModule = new ShareTransferModule();
const shareSerializationModule = new ShareSerializationModule();
const securityQuestionsModule = new SecurityQuestionsModule();

const tKey = new ThresholdKey({
  serviceProvider: serviceProvider,
  storageLayer,
  modules: {
    shareTransfer: shareTransferModule,
    securityQuestions: securityQuestionsModule,
    shareSerializationModule: shareSerializationModule,
  },
});

// disable on prod
const setMetadataKey = true;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [authVerifier] = useState('google');
  const [logs, setLogs] = useState([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const addLog = useCallback((...log: any) => {
    // @ts-ignore
    setLogs((logs) => ['>' + JSON.stringify(log), ...logs]);
  }, []);
  const [thirdShareRequired, setThirdShareRequired] = useState(false);
  const [freshPassword, onChangeFreshPassword] = useState('');
  const [confirmPassword, onChangeConfirmPassword] = useState('');

  useEffect(() => {
    try {
      CustomAuth.init({
        browserRedirectUri: 'https://scripts.toruswallet.io/redirect.html',
        redirectUri: 'torusapp://org.torusresearch.customauthexample/redirect',
        network: 'celeste', // details for test net
        enableLogging: true,
        enableOneKey: false,
      });
    } catch (error) {
      console.log(error, 'mounted caught');
    }
  });

  const login = async (reLogin = false) => {
    try {
      const { typeOfLogin, clientId, verifier, jwtParams } = (verifierMap as any)[authVerifier];
      const loginDetails = await CustomAuth.triggerLogin({
        typeOfLogin,
        verifier,
        clientId,
        jwtParams,
      });
      addLog({ loginDetails });

      let pbKey = new BN(loginDetails.privateKey, 16);
      tKey.serviceProvider.postboxKey = pbKey;
      // tKey.serviceProvider.postboxKey = new BN(ec.generatePrivate());
      // disable in prod
      if (setMetadataKey) {
        await tKey.storageLayer.setMetadata({
          privKey: pbKey,
          input: { message: 'KEY_NOT_FOUND' },
        });
      }
      const res = await tKey.initialize();
      // let keyDetails = await tKey.initialize(); // metadata is from the above step
      addLog({ res });
    } catch (error) {
      addLog(error, 'login caught');
    }
  };

  const createDeviceShare = async () => {
    try {
      const polyId = tKey.metadata.getLatestPublicPolynomial().getPolynomialID();
      const shares = tKey.shares[polyId];
      let deviceShare = null;
      for (const shareIndex in shares) {
        if (shareIndex !== '1') {
          deviceShare = shares[shareIndex].share;
        }
      }
      const serializedShare = (await (
        tKey.modules.shareSerializationModule as ShareSerializationModule
      ).serialize(deviceShare?.share as BN, 'mnemonic')) as string;
      addLog('serializedShare', serializedShare);
      // save to device
      await AsyncStorage.setItem('deviceShare', serializedShare);
    } catch (error) {
      addLog(error, 'login caught');
    }
  };

  const backupSecurityShare = async () => {
    try {
      // generate a new share(); - security question share - enter your phone number
      const securityShare = await (
        tKey.modules.securityQuestions as SecurityQuestionsModule
      ).generateNewShareWithSecurityQuestions(freshPassword.toString(), 'whats your password?');
      addLog({ securityShare });
      onChangeFreshPassword("");
      setThirdShareRequired(true);
    } catch (error) {
      addLog(error, 'login caught');
    }
  };

  const reLogin = async () => {
    await login(true);
    try {
      const deviceShareMnemonic = await AsyncStorage.getItem('deviceShare');
      addLog({ deviceShareMnemonic });
      if (deviceShareMnemonic) {
        const deviceShare = await (
          tKey.modules.shareSerializationModule as ShareSerializationModule
        ).deserialize(deviceShareMnemonic, 'mnemonic');

        tKey.inputShare(deviceShare);
        const reconstructKey = await tKey.reconstructKey();
        addLog({ reconstructKey });
      } else {
        setThirdShareRequired(true);
      }
    } catch (error) {
      addLog(error, 'login caught');
    }
  };

  const enterBackupShare = async (password: string) => {
    // generate a new share(); - security question share - enter your phone number
    try {
      await (
        tKey.modules.securityQuestions as SecurityQuestionsModule
      ).inputShareFromSecurityQuestions(password);
      const reconstructKey = await tKey.reconstructKey();
      addLog({ reconstructKey });
    } catch (error) {
      addLog(error, 'wrong password');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            padding: 40,
            paddingTop: 10,
            flexGrow: 1,
          }}
          style={{ flex: 1, paddingTop: 50 }}
        >
          <Button title="Login" onPress={() => login()} />
          <Button title="Store 2nd share on device" onPress={() => createDeviceShare()} />

          <TextInput
            style={{
              height: 40,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            // onChangeText={thirdShareRequired ? onChangeFreshPassword : onChangeConfirmPassword}
            value={thirdShareRequired ? confirmPassword : freshPassword}
            onChangeText={thirdShareRequired ? onChangeConfirmPassword : onChangeFreshPassword}
            placeholder={thirdShareRequired ? 'confirm your password' : 'enter your password'}
            keyboardType="numeric"
          />
          {!thirdShareRequired && (
            <Button title="Create 3rd Share as Password" onPress={() => backupSecurityShare()} />
          )}
          {thirdShareRequired && (
            <Button title="enter password" onPress={() => enterBackupShare(confirmPassword)} />
          )}
          <Button title="Re Login" onPress={() => reLogin()} />

          {logs.map((log, i) => (
            <Text
              key={`t-${i}`}
              style={{
                fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
                color: '#111',
                fontSize: 14,
              }}
            >
              {log}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
