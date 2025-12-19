import { AuthHeader } from "@/components/AuthHeader";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useStyleThemed } from "@/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function ClubRegisterScreen() {
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
        title="Register"
        caption="Create your account to join the community and connect with clubs and players."
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
        By registering, you agree to our Terms of Service and Privacy Policy.
      </ThemedText>
      <TouchableOpacity
        style={styles.link}
        onPress={() => router.navigate("/auth/login")}
      >
        <ThemedText style={styles.linkText}>
          Already have an account? Login
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
