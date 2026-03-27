import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

function detectPwaInstalled() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  const isStandaloneDisplayMode =
    typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = (window.navigator as NavigatorWithStandalone).standalone === true;
  const isTwa = document.referrer.startsWith('android-app://');

  return isStandaloneDisplayMode || isIosStandalone || isTwa;
}

export function usePwaInstalled() {
  const [isInstalled, setIsInstalled] = useState(detectPwaInstalled);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const updateStatus = () => setIsInstalled(detectPwaInstalled());

    updateStatus();
    mediaQuery.addEventListener('change', updateStatus);
    window.addEventListener('focus', updateStatus);

    return () => {
      mediaQuery.removeEventListener('change', updateStatus);
      window.removeEventListener('focus', updateStatus);
    };
  }, []);

  return isInstalled.toString();
}
