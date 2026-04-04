import { Stack } from "expo-router";

const Layout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="player" />
    <Stack.Screen name="coach" />
    <Stack.Screen name="edit" />
    <Stack.Screen name="change-password" />
    <Stack.Screen name="subscription" />
    <Stack.Screen name="security" />
  </Stack>
);

export default Layout;
