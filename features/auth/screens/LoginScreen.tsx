import { usersApi } from "@/api/auth";
import { AuthHeader } from "@/components/AuthHeader";
import { FormInput } from "@/components/FormInput";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { LoginForm, loginSchema } from "@/constants/validation";
import { createStyle, useStyle, useTheme } from "@/theme";
import { LoginResponse, Role, User } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { t: theme } = useTheme();
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: LoginForm) => {
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

      const user = await usersApi.custom<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${data.jwt}`,
        },
      });

      queryClient.setQueryData(["current-user"], user);

      router.replace(
        user.role.name === Role.ClubStaff.toString()
          ? "/club/(tabs)"
          : "/player/(tabs)",
      );
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: t("auth.wrongCredentials"),
      });
    },
  });

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { control, handleSubmit } = form;

  const onSubmit = (data: LoginForm) => {
    mutate(data);
  };

  return (
    <KeyboardAvoid style={styles.container}>
      <View style={styles.innerContainer}>
        <AuthHeader
          title={t("auth.signIn")}
          caption={t("auth.signInDescription")}
        />
        <FormInput
          placeholder={t("auth.emailPlaceholder")}
          control={control}
          name="email"
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput
          placeholder={t("auth.passwordPlaceholder")}
          control={control}
          name="password"
          keyboardType="default"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <ThemedButton
          title={t("auth.signIn")}
          onPress={handleSubmit(onSubmit)}
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
            onPress={() =>
              router.navigate({
                pathname: "/auth/club-registration",
                params: {
                  type: "club",
                },
              })
            }
          >
            <ThemedText style={styles.linkText}>{t("club")}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.link,
              {
                backgroundColor: theme.colors.secondary,
              },
            ]}
            onPress={() =>
              router.navigate({
                pathname: "/auth/player-registration",
                params: {
                  type: "player",
                },
              })
            }
          >
            <ThemedText style={styles.linkText}>{t("player")}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.link,
              {
                backgroundColor: theme.colors.accent,
              },
            ]}
            onPress={() =>
              router.navigate({
                pathname: "/auth/player-registration",
                params: {
                  type: "coach",
                },
              })
            }
          >
            <ThemedText style={styles.linkText}>{t("coach")}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoid>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: t.colors.background,
  },
  innerContainer: {
    justifyContent: "center",
    flex: 1,
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
    flexWrap: "wrap",
  },
}));
