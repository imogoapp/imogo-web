import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Funcionalidade em breve</ThemedText>
      <ThemedText style={styles.description}>
        Este modulo ainda nao ganhou tela propria. Por enquanto, volte para a home.
      </ThemedText>
      <Link href="/home" dismissTo style={styles.link}>
        <ThemedText type="link">Voltar para home</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
  },
  link: {
    marginTop: 8,
    paddingVertical: 15,
  },
});
