import { AuthHeader } from "@/components/AuthHeader";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useStyleThemed } from "@/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const styles = useStyleThemed((t) => ({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: t.colors.background,
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    link: { alignItems: "center" },
    linkText: { color: t.colors.secondary, fontSize: 15, fontWeight: "500" },
    caption: {
      color: t.colors.surface,
      fontSize: 12,
      opacity: 0.7,
      maxWidth: 320,
    },
  }));

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Sign In"
        caption="Sign in to your account to access your profile and connect with the community."
      />
      <ThemedTextInput
        placeholder="Enter phone or email"
        value={value}
        onChangeText={setValue}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ThemedButton
        title="Send OTP"
        onPress={() => {}}
        variant="primary"
        style={{ marginTop: 12 }}
      />
      <ThemedText variant="caption" style={styles.caption}>
        Secure login with OTP. We never share your information.
      </ThemedText>
      <TouchableOpacity
        style={styles.link}
        onPress={() => router.navigate("/auth/register")}
      >
        <ThemedText style={styles.linkText}>
          Dont have an account? Register
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
