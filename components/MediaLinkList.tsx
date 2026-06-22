import { MediaLink } from "@/features/auth/constants";
import { createStyle, useStyle } from "@/theme";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/icon-symbol";

const MediaLinkList = ({ links }: { links: MediaLink[] }) => {
  const styles = useStyle(stylesheet);
  const { t } = useTranslation();

  const openWebsite = async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <ThemedText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
        {t("profile.mediaLinks")}
      </ThemedText>
      {links.map((link) => (
        <Pressable
          key={link.url}
          style={styles.linkContainer}
          onPress={() => openWebsite(link.url)}
        >
          <ThemedText style={styles.link}>{link.title}</ThemedText>
          <IconSymbol name="video" color="gray" />
        </Pressable>
      ))}
    </View>
  );
};

const stylesheet = createStyle((t) => ({
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: t.spacing.sm,
  },
  link: {
    color: t.colors.text,
    fontSize: 14,
  },
}));

export default MediaLinkList;
