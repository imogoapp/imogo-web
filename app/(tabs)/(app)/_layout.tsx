import { Redirect, Stack } from 'expo-router';

import { useLoginRequired } from '@/hooks/use-route-guards';

export default function AppLayout() {
  const guard = useLoginRequired('/welcome');

  if (!guard.ready) {
    return null;
  }

  if (guard.redirectTo) {
    return <Redirect href={guard.redirectTo} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
