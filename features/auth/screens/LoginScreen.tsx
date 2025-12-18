import { otpsApi } from "@/api/otps";
import { AuthHeader } from "@/components/AuthHeader";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useStyleThemed } from "@/theme";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: (value: string) => {
      return otpsApi.create(
        value.includes("@") ? { email: value } : { phoneNumber: value }
      );
    },
    async onSuccess() {
      router.navigate("/auth/verify");
    },
  });

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
      color: "#333",
      fontSize: 12,
      opacity: 0.7,
      maxWidth: 320,
      marginBottom: 12,
    },
  }));

  const onSend = () => {
    console.log(value);

    mutate(value);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
        onPress={onSend}
        variant="primary"
        style={{ marginTop: 12 }}
        loading={isPending}
        disabled={value.length === 0 || isPending}
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
    </KeyboardAvoidingView>
  );
}
