import { usersApi } from "@/api/auth";
import { AuthHeader } from "@/components/AuthHeader";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { createStyle, useStyle, useTheme } from "@/theme";
import { LoginResponse, LoginValues, Role, User } from "@/types/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>({
    email: "amir@example.com",
    password: "password",
  });
  const queryClient = useQueryClient();

  const { t: theme } = useTheme();
  const styles = useStyle(stylesheet);
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
      <ThemedText style={styles.registerLabel}>
        {t("auth.registerAs")}
      </ThemedText>
      <View style={styles.registerButtons}>
        <TouchableOpacity
          style={[
            styles.link,
            {
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={() => router.navigate("/auth/club-registration")}
        >
          <ThemedText style={styles.linkText}>{t("club")}</ThemedText>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity
          style={[
            styles.link,
            {
              backgroundColor: theme.colors.secondary,
            },
          ]}
          onPress={() => router.navigate("/auth/player-registration")}
        >
          <ThemedText style={styles.linkText}>{t("player")}</ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoid>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: t.colors.background,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  link: {
    alignItems: "center",
    paddingVertical: 1.5,
    paddingHorizontal: 6,
    borderRadius: t.radii.full,
  },
  linkText: {
    fontWeight: "600",
    textTransform: "uppercase",
    color: t.colors.gray[0],
    fontSize: 15,
  },
  registerLabel: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "500",
    textTransform: "uppercase",
    textAlign: "center",
  },
  registerButtons: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    width: 1,
    height: 20,
    backgroundColor: t.colors.text,
  },
}));
