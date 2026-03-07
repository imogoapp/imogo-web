import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';

import { isLoggedIn } from '@/services/auth';

export default function IndexScreen() {
  const [target, setTarget] = useState<'/home' | '/welcome' | null>(null);

  useEffect(() => {
    setTarget(isLoggedIn() ? '/home' : '/welcome');
  }, []);

  if (!target) {
    return null;
  }

  return <Redirect href={target} />;
}
