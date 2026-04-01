import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { createStyle, useStyle } from "@/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function SubscriptionPortalScreen() {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const styles = useStyle(stylesheet);

  if (!url) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <ThemedText style={styles.errorTitle}>Invalid URL</ThemedText>
          <ThemedText style={styles.errorMessage}>
            No subscription portal URL configured.
          </ThemedText>
          <ThemedButton
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ThemedText>Loading...</ThemedText>
        </View>
      )}
      <WebView
        source={{ uri: url }}
        pullToRefreshEnabled
        cacheEnabled={false}
        style={styles.webview}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Close"
          onPress={() => router.back()}
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyle((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    zIndex: 10,
  },
  webview: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.spacer,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
  },
  errorContent: {
    padding: 24,
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
}));
