import { usersApi } from "@/api/auth";
import { FormInput } from "@/components/FormInput";
import Header from "@/components/Header";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { createStyle, useStyle } from "@/theme";
import { User } from "@/types/users";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { getUserFormDefaults, UserForm } from "../constants";
import useGetCurrentUser from "../hooks/useGetCurrentUser";

type FormValues = Pick<
  User,
  | "firstName"
  | "lastName"
  | "phoneNumber"
  | "location"
  | "nationality"
  | "citizenship"
>;

export default function EditUserInfo() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const { data: user } = useGetCurrentUser();

  console.log(user?.location, user?.nationality, user?.citizenship);

  const form = useForm<FormValues>({
    defaultValues: {
      ...getUserFormDefaults(user as User),
    },
  });
  const { control, handleSubmit } = form;

  const { mutate: updateUser } = useMutation({
    mutationFn: async (data: UserForm) =>
      await usersApi.custom(`/users/${user!.id}`, {
        body: data,
        method: "PUT",
      }),
    onError: (error: { error: { details: { message: string } } }) => {
      const message = error.error?.details?.message;

      Toast.show({ type: "error", text1: message });
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: t("auth.profileUpdated") });
    },
  });

  const onSubmit = (data: FormValues) => {
    updateUser(data);
  };

  return (
    <KeyboardAvoid>
      <Header title={t("profile.editUserInfo")} />
      <View style={styles.container}>
        <FormInput
          control={control}
          name="firstName"
          placeholder={t("register.firstName")}
        />
        <FormInput
          control={control}
          name="lastName"
          placeholder={t("register.lastName")}
        />
        <FormInput
          control={control}
          name="phoneNumber"
          placeholder={t("register.phoneNumber")}
          keyboardType="phone-pad"
        />
        <FormInput
          control={control}
          name="location"
          placeholder={t("register.location")}
        />
        <FormInput
          control={control}
          name="nationality"
          placeholder={t("register.nationality")}
        />
        <ThemedButton title={t("save")} onPress={handleSubmit(onSubmit)} />
      </View>
    </KeyboardAvoid>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: t.colors.background,
  },
}));
