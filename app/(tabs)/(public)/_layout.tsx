import { Redirect, Stack, usePathname } from 'expo-router';

import { useLogoutRequired } from '@/hooks/use-route-guards';

export default function PublicLayout() {
  const pathname = usePathname();
  const guard = useLogoutRequired('/home');
  const isTokenActionRoute =
    pathname === '/verify-email' || pathname === '/reset-password-confirm';

  if (!guard.ready) {
    return null;
  }

  if (guard.redirectTo && !isTokenActionRoute) {
    return <Redirect href={guard.redirectTo} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
