import { recruitmentPostsApi } from "@/api/recruitment-posts";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import Search from "@/components/Search";
import { ThemedText } from "@/components/ThemedText";
import Welcome from "@/components/Welcome";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { RecruitmentPostCard } from "@/features/players/components/RecruitmentPostCard";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle } from "@/theme";
import { RecruitmentPost } from "@/types/recruitment-posts";
import { StrapiListResponse } from "@/types/strapi";
import { Role } from "@/types/users";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function PlayerHome() {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: me } = useGetCurrentUser();
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);
  const recruitmentType =
    me?.role?.name === Role.Coach.toString() ? "coach" : "player";

  const { data, refetch, isPending } = useQuery<
    StrapiListResponse<RecruitmentPost>
  >({
    queryKey: [
      "recruitment-posts",
      "featured",
      recruitmentType,
      debouncedSearch,
    ],
    enabled: !!me?.role?.name,
    queryFn: async () => {
      return recruitmentPostsApi.list({
        // TODO: replace this with a dedicated featured filter once it's defined.
        pagination: { page: 1, pageSize: 10 },
        populate: {
          club: true,
        },
        filters: {
          $and: [
            { type: { $eq: recruitmentType } },
            ...(debouncedSearch
              ? [
                  {
                    $or: [
                      { title: { $containsi: debouncedSearch } },
                      { note: { $containsi: debouncedSearch } },
                      { position: { $containsi: debouncedSearch } },
                      {
                        club: {
                          clubName: { $containsi: debouncedSearch },
                        },
                      },
                    ],
                  },
                ]
              : []),
          ],
        } as any,
      });
    },
  });

  const recruitmentPosts = data?.data ?? [];

  return (
    <KeyboardAvoid style={styles.container} keyboardVerticalOffset={insets.top}>
      <Welcome
        title={t("home.welcome", { user: `${me?.firstName} ${me?.lastName}` })}
        subtitle={t("home.findYourNextOpportunity")}
        color="secondary"
      >
        <Search value={searchText} onChangeText={setSearchText} />
      </Welcome>
      <View style={styles.listContainer}>
        <ThemedText style={styles.title}>
          {t("home.featuredRecruitmentPosts")}
        </ThemedText>
        <FlatList
          data={recruitmentPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecruitmentPostCard
              post={item}
              onPress={() =>
                router.push(
                  `/player/recruitment-posts/${item.documentId ?? item.id}` as any,
                )
              }
            />
          )}
          onRefresh={refetch}
          refreshing={isPending}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="never"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </KeyboardAvoid>
  );
}

const stylesheet = createStyle((t) => ({
  container: {
    backgroundColor: t.colors.background,
    flex: 1,
  },
  listContainer: {
    paddingTop: t.spacing.xl,
    paddingHorizontal: t.spacing.lg,
    flex: 1.5,
  },
  title: {
    fontSize: t.spacing.lg,
    fontWeight: "bold",
    marginBottom: t.spacing.sm,
  },
}));
