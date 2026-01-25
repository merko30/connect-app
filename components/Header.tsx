import { createStyle, useStyle, useTheme } from "@/theme";
import { Header as RNHeader } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { Platform, Pressable } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

const Header = (props: React.ComponentProps<typeof RNHeader>) => {
  const { t } = useTheme();
  const router = useRouter();
  const styles = useStyle(stylesheet);
  return (
    <RNHeader
      {...props}
      headerLeft={() => (
        <Pressable onPress={router.back} style={styles.left}>
          <IconSymbol
            name="chevron.left"
            size={Platform.OS === "ios" ? 18 : 24}
            color={t.colors.text}
            style={styles.chevron}
          />
        </Pressable>
      )}
      headerStyle={styles.container}
      headerTitleStyle={styles.title}
    />
  );
};

const stylesheet = createStyle((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  title: {
    color: theme.colors.text,
  },
  left: { marginRight: 40 },
  chevron: {
    paddingLeft: Platform.OS === "ios" ? 48 : 20,
  },
}));

export default Header;
