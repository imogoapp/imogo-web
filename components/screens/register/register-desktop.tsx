import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Alert, ImageBackground, Linking, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppCheckbox } from '@/components/ui/app-checkbox';
import { AppDividerText } from '@/components/ui/app-divider-text';
import { AppInput } from '@/components/ui/app-input';
import { AppLegalConsent } from '@/components/ui/app-legal-consent';
import { AppLogo } from '@/components/ui/app-logo';
import { AppOptionCard } from '@/components/ui/app-option-card';
import { AppTitle } from '@/components/ui/app-title';

import styles from './styles/register-web-styles';

type RegisterPayload = {
  nome: string;
  telefone: string;
  email: string;
  password: string;
  origem: string;
  acceptedTerms: boolean;
};

type RegisterDesktopProps = {
  onRegisterPress?: (payload: RegisterPayload) => void;
  onGooglePress?: () => void;
};

const options = ['Facebook', 'Instagram', 'Google', 'Loja de aplicativos', 'Indicacao', 'Outro'] as const;

function validateEmail(emailInput: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function RegisterDesktop({ onRegisterPress, onGooglePress }: RegisterDesktopProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'query' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const canContinueToQuery = useMemo(() => {
    return (
      !!nome.trim() &&
      !!telefone.trim() &&
      !!email.trim() &&
      !!password.trim() &&
      !!confirmPassword.trim() &&
      acceptedTerms &&
      !emailError
    );
  }, [nome, telefone, email, password, confirmPassword, acceptedTerms, emailError]);
  const confirmPasswordError =
    confirmPassword.length > 0 && password !== confirmPassword ? 'As senhas precisam ser iguais.' : '';

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value.trim()) {
      setEmailError('');
      return;
    }

    setEmailError(validateEmail(value) ? '' : 'Por favor, insira um email valido.');
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const handleNextStep = () => {
    if (!nome || !telefone || !email || !password || !confirmPassword) {
      showAlert('Atencao', 'Preencha todos os campos obrigatorios.');
      return;
    }

    if (emailError || !validateEmail(email)) {
      showAlert('Atencao', 'Preencha um e-mail valido.');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Atencao', 'As senhas precisam ser iguais.');
      return;
    }

    if (!acceptedTerms) {
      showAlert('Atencao', 'Voce deve aceitar os Termos e Condicoes para criar a conta.');
      return;
    }

    setStep('query');
  };

  const handleCreateAccount = () => {
    if (!selectedOption) {
      showAlert('Atencao', 'Selecione uma opcao de como conheceu a imoGo.');
      return;
    }

    const payload: RegisterPayload = {
      nome,
      telefone,
      email,
      password,
      origem: selectedOption,
      acceptedTerms,
    };

    if (onRegisterPress) {
      setLoading(true);
      onRegisterPress(payload);
      setLoading(false);
    }

    setStep('success');
  };

  const handleGoogle = onGooglePress ?? (() => router.push('/modal'));
  const openTerms = () => Linking.openURL('https://sites.google.com/view/imogoapp/termos');
  const openPrivacy = () => Linking.openURL('https://sites.google.com/view/imogoapp/privacy-policy');

  return (
    <ImageBackground source={require('@/assets/img/bg.png')} style={styles.background} resizeMode="cover">
      <AppCard style={styles.card}>
        <AppLogo />

        {step === 'form' ? (
          <>
            <AppTitle marginBottom={24}>Dados de cadastro</AppTitle>

            <View style={styles.content}>              
              <AppInput
                label="Nome"
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                leadingIconName="person-outline"
              />
              <AppInput
                label="Telefone"
                placeholder="(61) 99999-9999"
                value={telefone}
                onChangeText={(value) => setTelefone(formatPhone(value))}
                keyboardType="numeric"
                leadingIconName="call-outline"
              />

              <View style={styles.separator} />

              <AppInput
                label="Email"
                placeholder="exemplo@email.com"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                leadingIconName="mail-outline"
                errorMessage={emailError}
              />

              <AppInput
                label="Senha"
                placeholder="Criar senha"
                value={password}
                onChangeText={setPassword}
                leadingIconName="lock-closed-outline"
                secureToggle
              />

              <AppInput
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leadingIconName="lock-closed-outline"
                secureToggle
                errorMessage={confirmPasswordError}
              />

              <View style={styles.legalRow}>
                <AppCheckbox checked={acceptedTerms} onToggle={() => setAcceptedTerms((state) => !state)} label="" />
                <AppLegalConsent onTermsPress={openTerms} onPrivacyPress={openPrivacy} />
              </View>

              <AppButton
                label="Proximo"
                onPress={handleNextStep}
                disabled={!canContinueToQuery}
                containerStyle={!canContinueToQuery ? styles.disabledButton : undefined}
              />
            </View>

            <View style={styles.authBlock}>
              <AppDividerText>Ou acesse com</AppDividerText>
              <AppButton
                label="Continuar com Google"
                variant="secondary"
                leftIconName="logo-google"
                onPress={handleGoogle}
              />
            </View>
          </>
        ) : null}

        {step === 'query' ? (
          <>
            <Text style={styles.queryOverline}>So mais uma coisa</Text>
            <Text style={styles.queryTitle}>Como conheceu a imoGo?</Text>
            <Text style={styles.querySubtitle}>Nos conte como chegou ate aqui</Text>

            <View style={styles.optionsList}>
              {options.map((option) => (
                <AppOptionCard
                  key={option}
                  label={option}
                  selected={selectedOption === option}
                  onPress={() => setSelectedOption((prev) => (prev === option ? null : option))}
                />
              ))}
            </View>

            <View style={styles.content}>
              <AppButton
                label={loading ? 'Criando conta...' : 'Concluir'}
                onPress={handleCreateAccount}
                disabled={loading || !selectedOption}
                containerStyle={loading || !selectedOption ? styles.disabledButton : undefined}
              />
            </View>
          </>
        ) : null}

        {step === 'success' ? (
          <>
            <Image source={require('@/assets/img/success.png')} style={styles.successImage} contentFit="contain" />
            <AppTitle marginBottom={8} color='#730d83'>
              Conta criada com sucesso!
            </AppTitle>
            <Text style={styles.successText}>
              Seu cadastro foi finalizado. Agora voce ja pode acessar a plataforma imoGo.
            </Text>
            <View style={styles.content}>
              <AppButton label="Ir para a tela de login" onPress={() => router.push('/login')} />
            </View>
          </>
        ) : null}
      </AppCard>
    </ImageBackground>
  );
}
