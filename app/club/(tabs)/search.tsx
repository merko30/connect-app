import { playersApi } from "@/api/players";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PlayerCard } from "@/features/players/components/PlayerCard";
import { useDebounce } from "@/hooks/useDebounce";
import { PlayerProfile } from "@/types/players";
import { StrapiListResponse } from "@/types/strapi";
import BottomSheet from "@gorhom/bottom-sheet";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayerSearchScreen() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);

  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isPending,
    hasNextPage,
  } = useInfiniteQuery<StrapiListResponse<PlayerProfile>>({
    queryKey: ["players", debouncedSearch],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam);
      return playersApi.list({
        pagination: { page, pageSize: 20 },
        filters: debouncedSearch
          ? {
              $or: [
                { firstName: { $containsi: debouncedSearch } },
                { lastName: { $containsi: debouncedSearch } },
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

  const players = data?.pages.flatMap((page) => page.data) ?? [];

  const onEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <ThemedTextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t("search")}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {}}
          accessibilityLabel="Filters"
        >
          <IconSymbol
            name="line.3.horizontal.decrease.circle"
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PlayerCard player={item} />}
        onRefresh={refetch}
        refreshing={isPending}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    padding: 120,
    alignItems: "center",
    backgroundColor: "white",
    zIndex: 100,
    elevation: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
