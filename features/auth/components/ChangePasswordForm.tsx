import { usersApi } from "@/api/auth";
import { FormInput } from "@/components/FormInput";
import RoleBasedButton from "@/components/RoleBasedButton";
import { createStyle, useStyle } from "@/theme";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleProp, View, ViewStyle } from "react-native";
import Toast from "react-native-toast-message";

type FormValues = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

interface ChangePasswordFormProps {
  buttonTitle?: string;
  style?: StyleProp<ViewStyle>;
}

export default function ChangePasswordForm({
  buttonTitle,
  style,
}: ChangePasswordFormProps) {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);

  const form = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: async (data: FormValues) =>
      usersApi.custom(`/auth/change-password`, {
        body: data,
        method: "POST",
      }),
    onError: (error: { error?: { message?: string } }) => {
      const rawMessage = error.error?.message ?? "";
      const message = rawMessage.includes("invalid")
        ? t("auth.currentPasswordInvalid")
        : t("errorOccurred");

      Toast.show({ type: "error", text1: message });
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: t("auth.passwordUpdated") });
      reset();
    },
  });

  const onSubmit = (data: FormValues) => {
    changePassword(data);
  };

  return (
    <View style={[styles.container, style]}>
      <FormInput
        control={control}
        name="currentPassword"
        placeholder={t("security.currentPassword")}
        secureTextEntry
        autoCapitalize="none"
      />
      <FormInput
        control={control}
        name="password"
        placeholder={t("security.newPassword")}
        secureTextEntry
        autoCapitalize="none"
      />
      <FormInput
        control={control}
        name="passwordConfirmation"
        placeholder={t("security.confirmNewPassword")}
        secureTextEntry
        autoCapitalize="none"
      />
      <RoleBasedButton
        title={buttonTitle ?? t("save")}
        onPress={handleSubmit(onSubmit)}
        loading={isPending}
        style={styles.button}
      />
    </View>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    gap: t.spacing.xs,
  },
  button: {
    marginTop: t.spacing.sm,
  },
}));
