import Logo from "@/assets/images/logo.svg";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, useColorScheme } from "react-native";

const Splash = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  return (
    <LinearGradient
      colors={isDarkMode ? ["#000000", "#1A1A1A"] : ["#FFFFFF", "#F2F2F2"]}
      style={styles.container}
    >
      <Logo width={120} height={120} />
    </LinearGradient>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
