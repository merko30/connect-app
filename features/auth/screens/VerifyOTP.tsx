import { otpsApi } from "@/api/otps";
import { AuthHeader } from "@/components/AuthHeader";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useStyleThemed } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import React, { Ref, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);
  const secondInputRef = useRef<TextInput>(null);
  const thirdInputRef = useRef<TextInput>(null);
  const fourthInputRef = useRef<TextInput>(null);
  const fifthInputRef = useRef<TextInput>(null);
  const sixthInputRef = useRef<TextInput>(null);

  const refs: Record<number, Ref<TextInput>> = {
    0: inputRef,
    1: secondInputRef,
    2: thirdInputRef,
    3: fourthInputRef,
    4: fifthInputRef,
    5: sixthInputRef,
  };

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: (value: string) => {
      return otpsApi.custom<{
        jwt: string;
        user: {
          role: any;
        };
      }>("/otps/verify", {
        method: "POST",
        body: { code: value },
      });
    },
    async onSuccess(data) {
      await AsyncStorage.setItem("token", data.jwt);
      const href: Href = data.user.role.name === "Player" ? "/player" : "/club";
      router.navigate(href);
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

  const onVerify = () => {
    if (code.replace(/\s/g, "").length === 6) {
      mutate(code);
    }
  };

  const onChangeText = (index: number) => (text: string) => {
    if (text.length === 1 && index < 5) {
      const nextRef = refs[index + 1] as React.RefObject<TextInput>;
      nextRef.current?.focus();
    }
    const newCode =
      code.substring(0, index) + text + code.substring(index + 1, 6);
    setCode(newCode);

    if (newCode.length === 6) {
      mutate(newCode);
    }
  };

  const onKeyPress = (index: number) => (e: any) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !code[index]) {
      const prevRef = refs[index - 1] as React.RefObject<TextInput>;
      prevRef.current?.focus();
      setCode(code.substring(0, index - 1) + " " + code.substring(index, 6));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <AuthHeader
        title="Verify OTP"
        caption="Enter the 6-digit code sent to your email or phone number."
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => {
          const ref = refs[index];
          return (
            <ThemedTextInput
              key={index}
              ref={ref}
              style={{
                textAlign: "center",
                fontSize: 24,
                width: 50,
                height: 50,
              }}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={onChangeText(index)}
              onKeyPress={onKeyPress(index)}
            />
          );
        })}
      </View>
      <ThemedButton
        title="Verify OTP"
        onPress={onVerify}
        variant="primary"
        style={{ marginTop: 12 }}
        loading={isPending}
        disabled={code.replace(/\s/g, "").length < 6 || isPending}
      />
    </KeyboardAvoidingView>
  );
}
