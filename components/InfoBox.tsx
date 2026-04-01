import { createStyle, useStyle } from "@/theme";
import { View } from "react-native";
import { ThemedText } from "./ThemedText";

type InfoBoxProps = {
  label: string;
  value: string | number;
};

export function InfoBox({ label, value }: InfoBoxProps) {
  const styles = useStyle(stylesheet);
  return (
    <View style={styles.infoBox}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const stylesheet = createStyle((t) => ({
  infoBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.colors.surface,
    borderRadius: t.radii.md,
    marginHorizontal: 2,
    paddingVertical: t.spacing.sm,
  },
  infoLabel: {
    color: t.colors.gray[500],
    textAlign: "center",
    fontSize: 11,
    marginBottom: 2,
  },
  infoValue: {
    color: t.colors.text,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
}));
