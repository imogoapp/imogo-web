import { router } from 'expo-router';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { createBaseWebNavigationItems } from '@/components/screens/home/home-tools';
import { BaseWebButton } from '@/components/ui/base-web-button';
import BaseWeb from '@/components/ui/base-web';
import { BaseWebFeatureCard } from '@/components/ui/base-web-feature-card';
import { AuthUser } from '@/services/auth';

import { precificadorContent } from './precificador-content';
import styles from '@/components/screens/home/styles/home-web-styles';

type PrecificadorDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

export default function PrecificadorDesktop({ user, onLogout }: PrecificadorDesktopProps) {
  const navigationItems = useMemo(
    () => createBaseWebNavigationItems({ activeId: 'precificador', onNavigate: (path) => router.replace(path as never) }),
    []
  );

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <View style={styles.heroCard}>
        <Text style={styles.welcomeMinimal}>Visao geral do modulo</Text>
        <Text style={styles.desktopDescription}>{precificadorContent.previewText}</Text>
        <View style={styles.desktopActionsRow}>
          <BaseWebButton label="Voltar para home" variant="secondary" leftIconName="home-outline" onPress={() => router.replace('/home')} />
          <BaseWebButton label="Abrir demonstracao" leftIconName="arrow-forward-outline" onPress={() => router.push('/modal')} />
        </View>
      </View>

      <View style={styles.desktopGrid}>
        <View style={styles.desktopGridItem}>
          <BaseWebFeatureCard
            title={precificadorContent.previewActionLabel}
            description="Estrutura pronta para ligar o fluxo desktop do precificador sem mudar o shell nem o padrao visual do app."
            icon={require('@/assets/icons/files.png')}
            accentColor="#730D83"
            onPress={() => router.push('/modal')}
          />
        </View>
        <View style={styles.desktopGridItem}>
          <BaseWebFeatureCard
            title="Acompanhamento do laudo"
            description="Espaco reservado para status, historico e revisoes do processo avaliativo dentro do desktop."
            icon={require('@/assets/icons/query.png')}
            accentColor="#E58B2A"
            disabled
          />
        </View>
      </View>
    </BaseWeb>
  );
}
