import { Redirect, Stack } from 'expo-router';

import { useLoginRequired } from '@/hooks/use-route-guards';
import { isLoggedIn } from '@/services/auth';

export default function AppLayout() {
  const guard = useLoginRequired('/welcome');

  if (!guard.ready) {
    return null;
  }

  if (guard.redirectTo || !isLoggedIn()) {
    return <Redirect href={guard.redirectTo ?? '/welcome'} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
