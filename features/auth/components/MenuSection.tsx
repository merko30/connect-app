import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { MenuItem } from "@/constants/profile";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
}

export default function MenuSection({ title, items }: MenuSectionProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>

      {items.map((item) => (
        <Link key={item.label} href={item.href}>
          <View style={styles.menuItem}>
            {item.icon && (
              <IconSymbol name={item.icon} size={20} color="black" />
            )}
            <ThemedText style={styles.menuLabel}>{t(item.label)}</ThemedText>
          </View>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    color: "#666",
    textTransform: "uppercase",
  },
  menuItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
