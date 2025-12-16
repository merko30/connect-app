import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <ThemedText>This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText>Go to home screen</ThemedText>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
