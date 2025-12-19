import { Stack } from "expo-router";

const Layout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="login" />
    <Stack.Screen name="club-registration" />
    <Stack.Screen name="player-registration" />
  </Stack>
);

export default Layout;
