import { router } from 'expo-router';
import { Image } from 'expo-image';
import axios, { isAxiosError } from 'axios';
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
  origem: number;
  acceptedTerms: boolean;
};

type RegisterDesktopProps = {
  onRegisterPress?: (payload: RegisterPayload) => void;
  onGooglePress?: () => void;
};

const options = ['Facebook', 'Instagram', 'Google', 'Loja de aplicativos', 'Indicacao', 'Outro'] as const;
const MIN_PASSWORD_LENGTH = 6;
const originMap: Record<(typeof options)[number], number> = {
  Facebook: 10,
  Instagram: 11,
  Google: 12,
  'Loja de aplicativos': 13,
  Indicacao: 14,
  Outro: 15,
};

const API_BASE_URL = (() => {
  const candidates = [process.env.EXPO_PUBLIC_API_IMOGO, process.env.API_IMOGO, 'https://api-homologacao.vercel.app'];
  const valid = candidates.find((value) => {
    if (!value) {
      return false;
    }

    const normalized = value.trim().toLowerCase();
    return normalized !== 'undefined' && normalized !== 'null';
  });

  return (valid ?? 'https://api-homologacao.vercel.app').replace(/\/+$/, '');
})();

type RegisterApiSuccess = {
  public_id: string;
  message: string;
};

type RegisterApiFieldError = {
  type?: string;
  loc?: (string | number)[];
  msg?: string;
  input?: string;
  ctx?: {
    min_length?: number;
  };
};

type RegisterApiError = {
  message?: string;
  detail?: string | RegisterApiFieldError[];
};

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

function getPasswordLengthError(passwordValue: string) {
  return passwordValue.length > 0 && passwordValue.length < MIN_PASSWORD_LENGTH
    ? `A senha deve ter no minimo ${MIN_PASSWORD_LENGTH} caracteres.`
    : '';
}

function getRegisterApiErrorMessage(errorData: RegisterApiError) {
  if (Array.isArray(errorData.detail)) {
    const passwordError = errorData.detail.find((item) => item.loc?.includes('password'));

    if (passwordError?.type === 'string_too_short') {
      const minLength = passwordError.ctx?.min_length ?? MIN_PASSWORD_LENGTH;
      return `A senha deve ter no minimo ${minLength} caracteres.`;
    }

    const firstMessage = errorData.detail.find((item) => typeof item.msg === 'string')?.msg;
    if (firstMessage) {
      return firstMessage;
    }
  }

  if (typeof errorData.detail === 'string') {
    return errorData.detail;
  }

  return errorData.message ?? 'Nao foi possivel criar sua conta. Tente novamente.';
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

  const passwordError = getPasswordLengthError(password);
  const canContinueToQuery = useMemo(() => {
    return (
      !!nome.trim() &&
      !!telefone.trim() &&
      !!email.trim() &&
      !!password.trim() &&
      !!confirmPassword.trim() &&
      password.length >= MIN_PASSWORD_LENGTH &&
      acceptedTerms &&
      !emailError &&
      password === confirmPassword
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

    if (password.length < MIN_PASSWORD_LENGTH) {
      showAlert('Atencao', `A senha deve ter no minimo ${MIN_PASSWORD_LENGTH} caracteres.`);
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

  const handleCreateAccount = async () => {
    if (!selectedOption) {
      showAlert('Atencao', 'Selecione uma opcao de como conheceu a imoGo.');
      return;
    }

    const origin = originMap[selectedOption as (typeof options)[number]];

    if (!origin) {
      showAlert('Atencao', 'Opcao de origem invalida.');
      return;
    }

    const payload: RegisterPayload = {
      nome,
      telefone,
      email,
      password,
      origem: origin,
      acceptedTerms,
    };

    setLoading(true);

    try {
      const response = await axios.post<RegisterApiSuccess>(`${API_BASE_URL}/api/v2/auth/register`, {
        name: nome.trim(),
        phone: telefone.trim(),
        email: email.trim(),
        password,
        origin,
        device: 20,
      }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 201) {
        showAlert('Erro no cadastro', 'Nao foi possivel criar sua conta. Tente novamente.');
        return;
      }

      const successData = response.data as RegisterApiSuccess | null;
      if (!successData?.public_id || !successData?.message) {
        showAlert('Erro no cadastro', 'Resposta de cadastro invalida. Tente novamente.');
        return;
      }

      onRegisterPress?.(payload);
      setStep('success');
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = (error.response?.data ?? {}) as RegisterApiError;
        let message = getRegisterApiErrorMessage(errorData);

        if (status === 409) {
          if (errorData.detail === 'email already registered') {
            message = 'Este e-mail ja esta cadastrado.';
          } else if (errorData.detail === 'phone already registered') {
            message = 'Este telefone ja esta cadastrado.';
          }
        }

        showAlert('Erro no cadastro', message);
        return;
      }

      showAlert('Erro de conexao', 'Nao foi possivel conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
                errorMessage={passwordError}
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

