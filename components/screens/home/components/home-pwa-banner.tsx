import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';

import styles from '@/components/screens/home/styles/home-pwa-banner-styles';

const DISMISS_KEY = 'imogo.home.pwa.banner.dismissed';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function readDismissedFlag() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(DISMISS_KEY) === 'true';
}

function persistDismissedFlag() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DISMISS_KEY, 'true');
}

function isAndroidWeb() {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') {
    return false;
  }

  return /Android/i.test(navigator.userAgent);
}

export function HomePwaBanner() {
  const [dismissed, setDismissed] = useState(readDismissedFlag);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const isAndroid = useMemo(() => isAndroidWeb(), []);
  const shouldShow = useMemo(() => Platform.OS === 'web' && !dismissed, [dismissed]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstallEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleClose = useCallback(() => {
    setDismissed(true);
    persistDismissedFlag();
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    const result = await installEvent.userChoice;

    if (result?.outcome === 'accepted') {
      setDismissed(true);
      persistDismissedFlag();
      setInstallEvent(null);
    }
  }, [installEvent]);

  const handleAndroidGuide = useCallback(() => {
    Alert.alert(
      'Instalar no Android',
      'No Chrome, toque em menu (3 pontos) e depois em "Instalar app" ou "Adicionar a tela inicial".'
    );
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Instale a versao PWA</Text>
          <Text style={styles.message}>Baixe o app no seu dispositivo para acesso rapido pela tela inicial.</Text>
        </View>

        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={16} color="#0E3A74" />
        </Pressable>
      </View>

      {installEvent || isAndroid ? (
        <View style={styles.actionRow}>
          {installEvent ? (
            <Pressable onPress={handleInstall} style={styles.installButton}>
              <Text style={styles.installButtonText}>Instalar agora</Text>
            </Pressable>
          ) : null}

          {isAndroid ? (
            <Pressable onPress={handleAndroidGuide} style={styles.guideButton}>
              <Text style={styles.guideButtonText}>Como baixar no Android</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
