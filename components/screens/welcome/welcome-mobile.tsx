import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Platform, View, useWindowDimensions } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppLogo } from '@/components/ui/app-logo';
import { AppTitle } from '@/components/ui/app-title';

import { createWelcomeMobileStyles } from './styles/welcome-mobile-styles';

type WelcomeMobileProps = {
  onRegisterPress?: () => void;
  onLoginPress?: () => void;
};

export default function WelcomeMobile({ onRegisterPress, onLoginPress }: WelcomeMobileProps) {
  const { width, height } = useWindowDimensions();
  const styles = createWelcomeMobileStyles(width, height);

  const handleRegister = onRegisterPress ?? (() => router.push('/modal'));
  const handleLogin = onLoginPress ?? (() => router.push('/modal'));

  return (
    <ImageBackground
      source={require('@/assets/img/bg.png')}
      style={styles.background}
      resizeMode="cover">
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'light'} translucent />

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <AppLogo width={width * 0.35} height={height * 0.12} marginBottom={0} />
        </View>

        <View style={styles.whiteContainer}>
          <AppTitle size={width * 0.06} marginBottom={height * 0.04}>
            Faca parte da imoGo
          </AppTitle>

          <View style={styles.actions}>
            <AppButton label="Criar cadastro" onPress={handleRegister} radius={30} />
            <AppButton label="Ja tenho acesso" variant="secondary" onPress={handleLogin} radius={30} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
