import { clubsApi } from "@/api/clubs";
import KeyboardAvoid from "@/components/KeyboardAvoid";
import Search from "@/components/Search";
import { ThemedText } from "@/components/ThemedText";
import Welcome from "@/components/Welcome";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { ClubCard } from "@/features/clubs/components/ClubCard";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle } from "@/theme";
import { ClubProfile } from "@/types/clubs";
import { StrapiListResponse } from "@/types/strapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function PlayerHome() {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: me } = useGetCurrentUser();

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<StrapiListResponse<ClubProfile>>({
      queryKey: ["players", debouncedSearch],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const page =
          typeof pageParam === "number" ? pageParam : Number(pageParam);

        return clubsApi.list({
          pagination: { page, pageSize: 20 },
          filters: debouncedSearch
            ? {
                $or: [
                  { clubName: { $containsi: debouncedSearch } },
                  { city: { $containsi: debouncedSearch } },
                ],
              }
            : undefined,
        });
      },
      getNextPageParam: (lastPage) => {
        const pagination = lastPage.meta?.pagination;
        if (!pagination) return undefined;

        const { page, pageCount } = pagination;
        return page < pageCount ? page + 1 : undefined;
      },
    });

  const clubs = data?.pages.flatMap((page) => page.data) ?? [];

  // TODO: implement onEndReachedThreshold and onMomentumScrollBegin to avoid multiple calls
  const onEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  return (
    <KeyboardAvoid style={styles.container} keyboardVerticalOffset={insets.top}>
      <Welcome
        title={t("home.welcome", { user: `${me?.firstName} ${me?.lastName}` })}
        subtitle={t("home.findYourNextClub")}
        color="secondary"
      >
        <Search value={searchText} onChangeText={setSearchText} />
      </Welcome>
      <View style={styles.listContainer}>
        <ThemedText style={styles.title}>{t("home.featuredClubs")}</ThemedText>
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => (
            <ClubCard
              club={item.item}
              onPress={() =>
                router.push(
                  `/player/club/${item.item.documentId ?? item.item.id}`,
                )
              }
            />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="never"
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
