import { Redirect, Stack } from 'expo-router';

import { useLogoutRequired } from '@/hooks/use-route-guards';

export default function PublicLayout() {
  const guard = useLogoutRequired('/home');

  if (!guard.ready) {
    return null;
  }

  if (guard.redirectTo) {
    return <Redirect href={guard.redirectTo} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
