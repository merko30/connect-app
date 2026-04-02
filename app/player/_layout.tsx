import { Stack } from "expo-router";

const Layout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="club/[id]" />
    <Stack.Screen name="recruitment-posts/[id]" />
  </Stack>
);

export default Layout;
