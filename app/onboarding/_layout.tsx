import { Stack } from "expo-router";

const Layout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="player" />
    <Stack.Screen name="club" />
  </Stack>
);

export default Layout;
