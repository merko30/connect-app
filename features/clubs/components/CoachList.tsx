import { coachesApi } from "@/api/coaches";
import { createStyle, useStyle } from "@/theme";
import { CoachProfile } from "@/types/coaches";
import { StrapiListResponse } from "@/types/strapi";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FlatList, Text } from "react-native";
import { CoachCard } from "./CoachCard";

type CoachListProps = {
  search: string;
};

export function CoachList({ search }: CoachListProps) {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();
  const normalizedSearch = search.trim();

  const { data, refetch, isPending } = useQuery<
    StrapiListResponse<CoachProfile>
  >({
    queryKey: ["coaches", "featured", normalizedSearch],
    queryFn: async () => {
      return coachesApi.list({
        // TODO: replace this with a dedicated featured filter once it's defined.
        pagination: { page: 1, pageSize: 10 },
        filters: normalizedSearch
          ? {
              $and: [
                { visibility: { $ne: "private" } },
                {
                  $or: [
                    { firstName: { $containsi: normalizedSearch } },
                    { lastName: { $containsi: normalizedSearch } },
                    { location: { $containsi: normalizedSearch } },
                  ],
                },
              ],
            }
          : { visibility: { $ne: "private" } },
      });
    },
  });

  const coaches = data?.data ?? [];

  return (
    <FlatList
      data={coaches}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <CoachCard coach={item} />}
      onRefresh={refetch}
      refreshing={isPending}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        coaches.length === 0 && styles.emptyContent,
      ]}
      // ListHeaderComponent={
      //   <ThemedText variant="subtitle" style={styles.title}>
      //     {t("home.featuredCoaches")}
      //   </ThemedText>
      // }
      ListEmptyComponent={
        !isPending ? (
          <Text style={styles.emptyText}>{t("home.noCoachesFound")}</Text>
        ) : null
      }
    />
  );
}

const stylesheet = createStyle((t) => ({
  title: {
    fontWeight: "bold",
    marginBottom: t.spacing.sm,
  },
  listContent: {
    paddingBottom: 140,
  },
  emptyContent: {
    flexGrow: 1,
  },
  emptyText: {
    color: t.colors.text,
    opacity: 0.7,
    textAlign: "center",
    marginTop: t.spacing.xl,
  },
}));
