import Header from "@/components/Header";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";
import { createStyle, useStyle } from "@/theme";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

function ChangePassword() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);

  return (
    <KeyboardAvoid>
      <Header title={t("profile.changePassword")} />
      <View style={styles.container}>
        <ChangePasswordForm />
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
