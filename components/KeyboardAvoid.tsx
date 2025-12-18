import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from "react-native";

const KeyboardAvoid = ({ children, ...props }: KeyboardAvoidingViewProps) => (
  <KeyboardAvoidingView
    style={[{ flex: 1 }, props.style]}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    {...props}
  >
    {children}
  </KeyboardAvoidingView>
);

export default KeyboardAvoid;
