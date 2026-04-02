import { Stack } from "expo-router";

const Layout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="not-verified" />
    <Stack.Screen name="recruitment-posts/create" />
  </Stack>
);

export default Layout;
