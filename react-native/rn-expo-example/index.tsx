import "./globals";
import "@ethersproject/shims";
import "@expo/metro-runtime";

import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";

// This file should only import and register the root. No components or exports
// should be added here.
renderRootComponent(App);
