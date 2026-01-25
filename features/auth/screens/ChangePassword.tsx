import { usersApi } from "@/api/auth";
import { FormInput } from "@/components/FormInput";
import Header from "@/components/Header";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import RoleBasedButton from "@/components/RoleBasedButton";
import { createStyle, useStyle } from "@/theme";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Toast from "react-native-toast-message";

type FormValues = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

function ChangePassword() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);

  const form = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  const { control, handleSubmit } = form;

  const { mutate: changePassword, isPending: isLoading } = useMutation({
    mutationFn: async (data: FormValues) =>
      await usersApi.custom(`/auth/change-password`, {
        body: data,
        method: "POST",
      }),
    onError: (error: { error: { message: string } }) => {
      let message = error.error?.message;
      if (message.includes("invalid")) {
        message = t("auth.currentPasswordInvalid");
      } else {
        message = t("errorOccurred");
      }

      Toast.show({ type: "error", text1: message });
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: t("auth.passwordUpdated") });
      form.reset();
    },
  });

  const onSubmit = (data: FormValues) => {
    changePassword(data);
  };

  return (
    <KeyboardAvoid>
      <Header title={t("profile.changePassword")} />
      <View style={styles.container}>
        <FormInput
          control={control}
          name="currentPassword"
          placeholder={t("auth.passwordPlaceholder")}
          secureTextEntry
        />
        <FormInput
          control={control}
          name="password"
          placeholder={t("register.password")}
          secureTextEntry
        />
        <FormInput
          control={control}
          name="passwordConfirmation"
          placeholder={t("register.confirmPassword")}
          secureTextEntry
        />
        <RoleBasedButton
          title={t("save")}
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />
      </View>
    </KeyboardAvoid>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 24,
    backgroundColor: t.colors.background,
  },
}));

export default ChangePassword;
