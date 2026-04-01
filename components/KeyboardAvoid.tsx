import { createStyle, useStyle } from "@/theme";
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type KeyboardAvoidProps = KeyboardAvoidingViewProps & {
  dismissOnTap?: boolean;
  keyboardVerticalOffset?: number;
};

const KeyboardAvoid = ({
  children,
  dismissOnTap = true,
  keyboardVerticalOffset = 0,
  ...props
}: KeyboardAvoidProps) => {
  const styles = useStyle(stylesheet);

  const content = <View style={styles.content}>{children}</View>;

  return (
    <KeyboardAvoidingView
      style={[styles.container, props.style]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
      {...props}
    >
      {dismissOnTap ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {content}
        </TouchableWithoutFeedback>
      ) : (
        content
      )}
    </KeyboardAvoidingView>
  );
};

const stylesheet = createStyle((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  content: {
    flex: 1,
  },
}));

export default KeyboardAvoid;
