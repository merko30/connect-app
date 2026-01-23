import { createStyle, useStyle, useTheme } from "@/theme";
import { Header as RNHeader } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
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
            size={20}
            color={t.colors.text}
            style={styles.chevron}
          />
        </Pressable>
      )}
    />
  );
};

const stylesheet = createStyle(() => ({
  left: { marginRight: 40 },
  chevron: {
    paddingLeft: 20,
  },
}));

export default Header;
