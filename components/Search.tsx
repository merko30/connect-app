import { createStyle, useStyle } from "@/theme";
import { useTranslation } from "react-i18next";
import { TextInputProps } from "react-native";
import { ThemedTextInput } from "./ThemedTextInput";

const Search = ({ style, ...props }: TextInputProps) => {
  const { t } = useTranslation();
  const styles = useStyle(stylesheet);
  return (
    <ThemedTextInput
      placeholder={t("search")}
      style={[styles.search, style]}
      {...props}
    />
  );
};

const stylesheet = createStyle((t) => ({
  listContainer: {
    paddingTop: t.spacing.md,
    paddingHorizontal: t.spacing.md,
    flex: 1.5,
  },
  title: {
    fontWeight: "bold",
    marginBottom: t.spacing.sm,
  },
  search: {
    marginHorizontal: t.spacing.lg,
    marginVertical: t.spacing.xl,
    borderRadius: t.radii.full,
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    borderColor: "transparent",
  },
}));

export default Search;
