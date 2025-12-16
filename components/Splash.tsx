import Logo from "@/assets/images/logo.svg";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

const Splash = () => {
  return (
    <LinearGradient colors={["#FFFFFF", "#F2F2F2"]} style={styles.container}>
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
