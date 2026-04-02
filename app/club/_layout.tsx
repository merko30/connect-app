import { Stack } from "expo-router";

const Layout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="not-verified" />
    <Stack.Screen name="recruitment-posts/create" />
    <Stack.Screen name="recruitment-posts/[id]/edit" />
  </Stack>
);

export default Layout;
