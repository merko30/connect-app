import { usersApi } from "@/api/auth";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import RoleBasedButton from "@/components/RoleBasedButton";
import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";
import SettingsScreenLayout from "@/features/auth/components/SettingsScreenLayout";
import SettingsSectionCard from "@/features/auth/components/SettingsSectionCard";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { createStyle, useStyle } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

export default function SecuritySettingsScreen() {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useGetCurrentUser();

  const { mutate: deleteAccount, isPending } = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("No user id");

      await usersApi.custom(`/users/${user.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: async () => {
      await AsyncStorage.removeItem("token");
      queryClient.setQueryData(["current-user"], () => null);
      router.navigate("/auth/login");
    },
    onError: () => {
      Alert.alert(t("errorOccurred"));
    },
  });

  const onPressDelete = () => {
    Alert.alert(
      t("deleteAccount.confirmTitle"),
      t("deleteAccount.confirmMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => deleteAccount(),
        },
      ],
    );
  };

  return (
    <KeyboardAvoid>
      <SettingsScreenLayout
        headerTitle={t("profile.security")}
        title={t("security.title")}
        subtitle={t("security.subtitle")}
      >
        <SettingsSectionCard
          title={t("security.passwordSectionTitle")}
          subtitle={t("security.passwordSectionSubtitle")}
          style={styles.section}
        >
          <ChangePasswordForm />
        </SettingsSectionCard>

        <SettingsSectionCard
          title={t("security.deleteSectionTitle")}
          subtitle={t("security.deleteSectionSubtitle")}
          style={styles.section}
        >
          <RoleBasedButton
            title={t("deleteAccount.button")}
            onPress={onPressDelete}
            loading={isPending}
            style={styles.deleteButton}
          />
        </SettingsSectionCard>
      </SettingsScreenLayout>
    </KeyboardAvoid>
  );
}

const stylesheet = createStyle((t) => ({
  section: {
    marginTop: t.spacing.md,
    marginBottom: t.spacing.md,
  },
  deleteButton: {
    marginTop: t.spacing.lg,
  },
}));
