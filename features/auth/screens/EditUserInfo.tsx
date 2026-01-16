import { FormInput } from "@/components/FormInput";
import Header from "@/components/Header";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import { ThemedButton } from "@/components/ThemedButton";
import { createStyle, useStyle } from "@/theme";
import { User } from "@/types/users";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

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
  const form = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      location: "",
      nationality: "",
      citizenship: "",
    },
  });
  const { control, handleSubmit } = form;

  const onSubmit = (data: FormValues) => {
    // TODO: Implement update logic (API call)
    console.log("Updated user info:", data);
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
