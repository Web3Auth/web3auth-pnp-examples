/**
 * @format
 */

import {AppRegistry} from 'react-native';

import './global';
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
