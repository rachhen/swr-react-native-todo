import React from "react";
import { SWRConfig } from "swr";
import { StatusBar } from "expo-status-bar";
import {
  AppState,
  AppStateStatus,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import Input from "./components/Input";
import Todos from "./components/Todos";

export default function App() {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => {
          return true;
        },
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState: AppStateStatus) => {
            if (
              appState.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              callback();
            }
            appState = nextAppState;
          };

          AppState.addEventListener("change", onAppStateChange);
        },
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Todos />
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </SWRConfig>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
