import { router } from 'expo-router';
import { Image } from 'expo-image';
import axios, { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { Alert, ImageBackground, Linking, Text, View, TouchableOpacity } from 'react-native';

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
import { useAnalytics } from '@/hooks/use-analytics';

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
    ? `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
    : '';
}

function getRegisterApiErrorMessage(errorData: RegisterApiError) {
  if (Array.isArray(errorData.detail)) {
    const passwordError = errorData.detail.find((item) => item.loc?.includes('password'));

    if (passwordError?.type === 'string_too_short') {
      const minLength = passwordError.ctx?.min_length ?? MIN_PASSWORD_LENGTH;
      return `A senha deve ter no mínimo ${minLength} caracteres.`;
    }

    const firstMessage = errorData.detail.find((item) => typeof item.msg === 'string')?.msg;
    if (firstMessage) {
      return firstMessage;
    }
  }

  if (typeof errorData.detail === 'string') {
    return errorData.detail;
  }

  return errorData.message ?? 'Não foi possível criar sua conta. Tente novamente.';
}

export default function RegisterDesktop({ onRegisterPress, onGooglePress }: RegisterDesktopProps) {
  const { trackEvent } = useAnalytics();
  trackEvent();
  
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
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
      !telefoneError &&
      password === confirmPassword
    );
  }, [nome, telefone, email, password, confirmPassword, acceptedTerms, emailError, telefoneError]);
  const confirmPasswordError =
    confirmPassword.length > 0 && password !== confirmPassword ? 'As senhas precisam ser iguais.' : '';

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value.trim()) {
      setEmailError('');
      return;
    }

    setEmailError(validateEmail(value) ? '' : 'Por favor, insira um e-mail válido.');
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const handleNextStep = () => {
    if (!nome || !telefone || !email || !password || !confirmPassword) {
      showAlert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (emailError || !validateEmail(email)) {
      showAlert('Atenção', 'Preencha um e-mail válido.');
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      showAlert('Atenção', `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Atenção', 'As senhas precisam ser iguais.');
      return;
    }

    if (!acceptedTerms) {
      showAlert('Atenção', 'Você deve aceitar os Termos e Condições para criar a conta.');
      return;
    }

    setStep('query');
  };

  const handleCreateAccount = async () => {
    if (!selectedOption) {
      showAlert('Atenção', 'Selecione uma opção de como conheceu a imoGo.');
      return;
    }

    const origin = originMap[selectedOption as (typeof options)[number]];

    if (!origin) {
      showAlert('Atenção', 'Opção de origem inválida.');
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
        showAlert('Erro no cadastro', 'Não foi possível criar sua conta. Tente novamente.');
        return;
      }

      const successData = response.data as RegisterApiSuccess | null;
      if (!successData?.public_id || !successData?.message) {
        showAlert('Erro no cadastro', 'Resposta de cadastro inválida. Tente novamente.');
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
            setEmailError('Este e-mail já está cadastrado.');
            setStep('form');
            return;
          } else if (errorData.detail === 'phone already registered') {
            setTelefoneError('Este telefone já está cadastrado.');
            setStep('form');
            return;
          }
        }

        showAlert('Erro no cadastro', message);
        return;
      }

      showAlert('Erro de conexão', 'Não foi possível conectar com o servidor. Tente novamente.');
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
                onChangeText={(value) => {
                  setTelefone(formatPhone(value));
                  if (telefoneError) setTelefoneError('');
                }}
                keyboardType="numeric"
                leadingIconName="call-outline"
                errorMessage={telefoneError}
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
                label="Próximo"
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

              <TouchableOpacity onPress={() => router.push('/login')} style={{ alignItems: 'center', marginTop: 16 }}>
                <Text style={{ color: '#730d83', fontSize: 14, fontWeight: 'bold' }}>Já tenho conta? Fazer login</Text>
              </TouchableOpacity>
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

