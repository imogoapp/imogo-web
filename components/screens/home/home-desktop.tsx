import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type HomeDesktopProps = {
  width: number;
  isPwaInstalled: boolean;
};

export function HomeDesktop({ width, isPwaInstalled }: HomeDesktopProps) {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#8BC6EC', dark: '#243B53' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome Desktop</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.desktopGrid}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Screen type (PWA)</ThemedText>
          <ThemedText>{`Detected: desktop (${Math.round(width)}px width)`}</ThemedText>
          <ThemedText>{`PWA installed: ${isPwaInstalled ? 'yes' : 'no'}`}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Desktop Experience</ThemedText>
          <ThemedText>
            Esta versao usa mais area horizontal e secoes amplas para destacar informacoes.
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.desktopGrid}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Developer Tools</ThemedText>
          <ThemedText>
            Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>. Press{' '}
            <ThemedText type="defaultSemiBold">
              {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })}
            </ThemedText>{' '}
            to open developer tools.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Navigation</ThemedText>
          <Link href="/modal">
            <ThemedText type="link">Open modal</ThemedText>
          </Link>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  desktopGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    gap: 8,
    marginBottom: 12,
  },
  reactLogo: {
    height: 220,
    width: 360,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
