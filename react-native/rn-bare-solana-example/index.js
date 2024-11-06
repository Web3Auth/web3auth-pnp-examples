/* eslint-disable simple-import-sort/imports */
import { AppRegistry } from "react-native";
import "react-native-get-random-values";
import "./globals";
import App from "./App";
import { name as appName } from "./app.json";
AppRegistry.registerComponent(appName, () => App);
