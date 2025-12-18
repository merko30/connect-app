import { usersApi } from "@/api/auth";
import { AuthHeader } from "@/components/AuthHeader";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useStyleThemed } from "@/theme";
import { LoginResponse, LoginValues, Role, User } from "@/types/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>({
    email: "amir@example.com",
    password: "password",
  });
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: LoginValues) => {
      return usersApi.custom<LoginResponse>("/auth/local", {
        method: "POST",
        body: {
          identifier: value.email,
          password: value.password,
        },
      });
    },
    async onSuccess(data: LoginResponse) {
      AsyncStorage.setItem("token", data.jwt);
      console.log(data);

      const user = await usersApi.custom<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${data.jwt}`,
        },
      });

      queryClient.setQueryData(["current-user"], user);

      router.replace(
        user.role.name === Role.ClubStaff.toString()
          ? "/club/(tabs)"
          : "/player/(tabs)"
      );
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: t("auth.wrongCredentials"),
      });
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
    linkText: {
      color: t.colors.secondary,
      fontSize: 15,
      fontWeight: "500",
      marginTop: 4,
    },
  }));

  const onSubmit = () => {
    if (!values.email || !values.password) {
      return;
    }

    mutate(values);
  };

  const onChange = (name: string) => (value: string) => {
    setValues((old) => ({
      ...old,
      [name]: value,
    }));
  };

  return (
    <KeyboardAvoid style={styles.container}>
      <AuthHeader
        title={t("auth.signIn")}
        caption={t("auth.signInDescription")}
      />
      <ThemedTextInput
        placeholder={t("auth.emailPlaceholder")}
        value={values.email}
        onChangeText={onChange("email")}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ThemedTextInput
        placeholder={t("auth.passwordPlaceholder")}
        value={values.password}
        onChangeText={onChange("password")}
        keyboardType="default"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ThemedButton
        title={t("auth.signIn")}
        onPress={onSubmit}
        variant="primary"
        style={{ marginTop: 12 }}
        loading={isPending}
        disabled={isPending}
      />
      <TouchableOpacity
        style={styles.link}
        onPress={() => router.navigate("/auth/register")}
      >
        <ThemedText style={styles.linkText}>{t("auth.noAccount")}</ThemedText>
      </TouchableOpacity>
    </KeyboardAvoid>
  );
}
