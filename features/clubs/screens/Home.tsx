import KeyboardAvoid from "@/components/KeyboardAvoid";
import Search from "@/components/Search";
import Welcome from "@/components/Welcome";
import useGetCurrentUser from "@/features/auth/hooks/useGetCurrentUser";
import { useDebounce } from "@/hooks/useDebounce";
import { createStyle, useStyle, useTheme } from "@/theme";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";
import { CoachList } from "../components/CoachList";
import { PlayerList } from "../components/PlayerList";

type HomeRoute = {
  key: "players" | "coaches";
  title: string;
};

export function ClubHome() {
  const styles = useStyle(stylesheet);
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const router = useRouter();
  const { data: me } = useGetCurrentUser();
  const [searchText, setSearchText] = useState("");
  const [index, setIndex] = useState(0);
  const debouncedSearch = useDebounce(searchText, 500);

  const routes = useMemo<HomeRoute[]>(
    () => [
      { key: "players", title: t("players") },
      { key: "coaches", title: t("coaches") },
    ],
    [t],
  );

  const renderScene = ({ route }: { route: HomeRoute }) => {
    switch (route.key) {
      case "players":
        return <PlayerList search={debouncedSearch} />;
      case "coaches":
        return <CoachList search={debouncedSearch} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoid style={styles.container} keyboardVerticalOffset={insets.top}>
      <Welcome
        title={t("home.welcome", { user: `${me?.firstName} ${me?.lastName}` })}
        subtitle={t("home.findAndRecruit")}
      >
        <Search value={searchText} onChangeText={setSearchText} />
      </Welcome>

      <View style={styles.listContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          style={styles.tabView}
          lazy
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={styles.tabIndicator}
              pressColor="transparent"
              activeColor={theme.t.colors.text}
              inactiveColor={theme.t.colors.text}
            />
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/club/recruitment-posts/create")}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </KeyboardAvoid>
  );
}

const stylesheet = createStyle((t) => ({
  container: { backgroundColor: t.colors.background, flex: 1 },
  listContainer: {
    paddingTop: t.spacing.md,
    paddingHorizontal: t.spacing.md,
    flex: 1,
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.lg,
    marginBottom: t.spacing.md,
    elevation: 0,
    shadowOpacity: 0,
    overflow: "hidden",
  },
  tabIndicator: {
    backgroundColor: t.colors.secondary,
    height: 3,
    borderRadius: 999,
  },
  fab: {
    position: "absolute",
    bottom: 120,
    right: t.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: t.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  fabIcon: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "400",
  },
}));
