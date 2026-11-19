import { router } from 'expo-router';
import { View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';
import { AuthDesktopShell } from '@/components/ui/auth-desktop-shell';

import styles from './styles/welcome-web-styles';

type WelcomeDesktopProps = {
  onRegisterPress?: () => void;
  onLoginPress?: () => void;
};

export default function WelcomeDesktop({
  onRegisterPress,
  onLoginPress,
}: WelcomeDesktopProps) {

  const handleRegister = onRegisterPress ?? (() => router.push('/register'));
  const handleLogin = onLoginPress ?? (() => router.push('/login'));

  return (
    <AuthDesktopShell
      bannerTitle="Bem-vindo à imoGo!"
      bannerSubtitle="Tudo o que você precisa para simular financiamento, avaliar imóveis e emitir certidões com agilidade."
    >
      <AppLogo />
      <AppTitle>Faça parte da imoGo</AppTitle>

      <View style={styles.actions}>
        <AppButton label="Criar cadastro" onPress={handleRegister} />
        <AppButton label="Ja tenho acesso" variant="secondary" onPress={handleLogin} />
      </View>
    </AuthDesktopShell>
  );
}
