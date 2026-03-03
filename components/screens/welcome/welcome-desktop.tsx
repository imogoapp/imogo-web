import { router } from 'expo-router';
import Head from 'expo-router/head';
import { ImageBackground, Platform, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';

import styles from './styles/welcome-web-styles';

type WelcomeDesktopProps = {
  onRegisterPress?: () => void;
  onLoginPress?: () => void;
};

export default function WelcomeDesktop({
  onRegisterPress,
  onLoginPress,
}: WelcomeDesktopProps) {
  const handleRegister = onRegisterPress ?? (() => router.push('/modal'));
  const handleLogin = onLoginPress ?? (() => router.push('/modal'));

  return (
    <>

      <ImageBackground
        source={require('@/assets/img/bg.png')}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.card}>
          <AppLogo />
          <AppTitle>Faca parte da imoGo</AppTitle>

          <View style={styles.actions}>
            <AppButton label="Criar cadastro" onPress={handleRegister} />
            <AppButton label="Ja tenho acesso" variant="secondary" onPress={handleLogin} />
          </View>
        </View>
      </ImageBackground>
    </>
  );
}
