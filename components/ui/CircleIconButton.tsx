import { useStyleThemed } from "@/theme";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { IconSymbol, IconSymbolName } from "./icon-symbol";

type Props = TouchableOpacityProps & {
  name: IconSymbolName;
  color: string;
  /** Background fill — defaults to a 15% opacity tint of `color` */
  background?: string;
  size?: number;
};

export function CircleIconButton({
  name,
  color,
  background,
  size = 18,
  style,
  ...rest
}: Props) {
  const styles = useStyleThemed(() => ({
    circle: {
      width: size + 16,
      height: size + 16,
      borderRadius: (size + 16) / 2,
      backgroundColor: background ?? `${color}22`,
      alignItems: "center",
      justifyContent: "center",
    },
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={[styles.circle, style]}
      {...rest}
    >
      <IconSymbol name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}
