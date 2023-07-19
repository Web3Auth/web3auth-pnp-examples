/**
 * @format
 */

import {AppRegistry} from 'react-native';
import './globals';
import App from './App';
import {name as appName} from './app.json';
console.log('index.js');
AppRegistry.registerComponent(appName, () => App);
