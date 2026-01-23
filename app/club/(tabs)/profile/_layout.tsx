import { Stack } from "expo-router";

const Layout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="club" />
    <Stack.Screen name="edit" />
  </Stack>
);

export default Layout;
