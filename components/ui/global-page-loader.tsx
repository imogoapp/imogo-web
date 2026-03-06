import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function GlobalPageLoader() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#730d83" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    elevation: 99999,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
