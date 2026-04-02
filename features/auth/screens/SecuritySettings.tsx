import { usersApi } from "@/api/auth";
import Header from "@/components/Header";
import RoleBasedButton from "@/components/RoleBasedButton";
import { ThemedText } from "@/components/ThemedText";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { createStyle, useStyle } from "@/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <Header title={t("profile.security")} />

      <View style={styles.content}>
        <ThemedText variant="subtitle" style={styles.title}>
          {t("security.title")}
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          {t("security.subtitle")}
        </ThemedText>

        <View style={styles.section}>
          <ThemedText variant="subtitle" style={styles.sectionTitle}>
            {t("security.deleteSectionTitle")}
          </ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            {t("security.deleteSectionSubtitle")}
          </ThemedText>

          <RoleBasedButton
            title={t("deleteAccount.button")}
            onPress={onPressDelete}
            loading={isPending}
            style={styles.deleteButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.lg,
  },
  title: {
    marginBottom: t.spacing.sm,
    fontWeight: "700",
  },
  subtitle: {
    color: t.colors.gray[500],
    marginBottom: t.spacing.lg,
  },
  section: {
    marginTop: t.spacing.md,
    marginBottom: t.spacing.md,
    backgroundColor: t.colors.surface,
    padding: t.spacing.md,
    borderRadius: t.radii.md,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: t.spacing.xs,
  },
  sectionSubtitle: {
    color: t.colors.gray[500],
  },
  deleteButton: {
    marginTop: t.spacing.lg,
  },
}));
