import { createStyle, useStyle } from "@/theme";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from "react-native";

const KeyboardAvoid = ({ children, ...props }: KeyboardAvoidingViewProps) => {
  const styles = useStyle(stylesheet);
  return (
    <KeyboardAvoidingView
      style={[styles.container, props.style]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: t.colors.background,
  },
}));

export default KeyboardAvoid;
