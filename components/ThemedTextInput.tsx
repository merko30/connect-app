import React, { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { useStyleThemed } from "../theme";

export interface ThemedTextInputProps extends TextInputProps {
  error?: boolean;
}

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
  ({ error, style, ...props }, ref) => {
    const themed = useStyleThemed((t) => ({
      input: {
        backgroundColor: t.colors.surface,
        color: t.colors.text,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: error ? "#E53935" : t.colors.text + "33",
        marginBottom: error ? 4 : 12,
      },
    }));
    return (
      <TextInput
        style={[themed.input, style]}
        placeholderTextColor="#888"
        {...props}
        ref={ref}
      />
    );
  },
);

ThemedTextInput.displayName = "ThemedTextInput";
