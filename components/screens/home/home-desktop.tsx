import { ScrollView, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppLogo } from '@/components/ui/app-logo';
import { AuthUser } from '@/services/auth';
import styles from './styles/home-web-styles';

type HomeDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

export default function HomeDesktop({ user, onLogout }: HomeDesktopProps) {
  const userName = typeof user?.name === 'string' ? user.name : 'Usuario';
  const userEmail = typeof user?.email === 'string' ? user.email : 'Email indisponivel';

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.card}>
          <AppLogo width={180} height={64} marginBottom={16} />
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>Bem-vindo, {userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>
          <Text style={styles.message}>Use a versao mobile para acessar os modulos da plataforma.</Text>
          <AppButton label="Sair" variant="secondary" onPress={onLogout} />
        </AppCard>
      </ScrollView>
    </View>
  );
}
