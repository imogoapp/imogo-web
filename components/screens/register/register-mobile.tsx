import { router } from 'expo-router';
import { Image } from 'expo-image';
import axios, { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCheckbox } from '@/components/ui/app-checkbox';
import { AppInput } from '@/components/ui/app-input';
import { AppLegalConsent } from '@/components/ui/app-legal-consent';
import { AppOptionCard } from '@/components/ui/app-option-card';
import { AppStepProgress } from '@/components/ui/app-step-progress';
import { AppTitle } from '@/components/ui/app-title';

import { createRegisterMobileStyles } from './styles/register-mobile-styles';

type RegisterMobileProps = {
  onRegisterPress?: (payload: {
    nome: string;
    sobrenome: string;
    telefone: string;
    email: string;
    password: string;
    origem: number;
    acceptedTerms: boolean;
  }) => void;
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

export default function RegisterMobile({ onRegisterPress }: RegisterMobileProps) {
  
  const { width, height } = useWindowDimensions();
  const styles = createRegisterMobileStyles(width, height);
  const titleSize = Math.min(
    Platform.select({ ios: width * 0.055, android: width * 0.05, default: width * 0.05 }) ?? width * 0.05,
    24
  );
  const labelSize = Math.min(
    Platform.select({ ios: width * 0.032, android: width * 0.034, default: width * 0.034 }) ?? width * 0.034,
    13
  );
  const inputSize = Math.min(
    Platform.select({ ios: width * 0.04, android: width * 0.045, default: width * 0.045 }) ?? width * 0.045,
    16
  );
  const inputHeight = height * 0.06;
  const inputRadius = 8;
  const buttonLabelSize = Math.min(
    Platform.select({ ios: width * 0.04, android: width * 0.045, default: width * 0.045 }) ?? width * 0.045,
    16
  );
  const buttonRadius = 30;
  const disabledButtonLabelColor = '#C4C4C4';
  const enabledButtonLabelColor = '#F5F5F5';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordError = getPasswordLengthError(password);
  const confirmPasswordError =
    confirmPassword.length > 0 && password !== confirmPassword ? 'As senhas não coincidem.' : '';

  const isStep1Valid = useMemo(() => {
    return !!nome.trim() && !!sobrenome.trim() && telefone.replace(/\D/g, '').length === 11 && !telefoneError;
  }, [nome, sobrenome, telefone, telefoneError]);

  const isStep2Valid = useMemo(() => {
    return (
      !!email.trim() &&
      !!password.trim() &&
      !!confirmPassword.trim() &&
      validateEmail(email) &&
      !emailError &&
      password.length >= MIN_PASSWORD_LENGTH &&
      password === confirmPassword &&
      acceptedTerms
    );
  }, [email, emailError, password, confirmPassword, acceptedTerms]);

  const isStep3Valid = !!selectedOption;

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value.trim()) {
      setEmailError('');
      return;
    }

    setEmailError(validateEmail(value) ? '' : 'Por favor, insira um e-mail válido.');
  };

  const nextFromStep1 = () => {
    if (!isStep1Valid) {
      showAlert('Atenção', 'Preencha nome, sobrenome e telefone válido.');
      return;
    }

    setStep(2);
  };

  const nextFromStep2 = () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      showAlert('Atenção', `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    if (!isStep2Valid) {
      showAlert('Atenção', 'Revise os dados de cadastro e os termos.');
      return;
    }

    setStep(3);
  };

  const finishRegister = async () => {
    if (!selectedOption) {
      showAlert('Atenção', 'Selecione uma opção de origem.');
      return;
    }

    const origin = originMap[selectedOption as (typeof options)[number]];

    if (!origin) {
      showAlert('Atenção', 'Opção de origem inválida.');
      return;
    }

    const payload = {
      nome,
      sobrenome,
      telefone,
      email,
      password,
      origem: origin,
      acceptedTerms,
    };

    setLoading(true);
    try {
      const response = await axios.post<RegisterApiSuccess>(`${API_BASE_URL}/api/v2/auth/register`, {
        name: `${nome.trim()} ${sobrenome.trim()}`.trim(),
        phone: telefone.trim(),
        email: email.trim(),
        password,
        origin,
        device: 10,
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
      setStep(4);
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = (error.response?.data ?? {}) as RegisterApiError;
        let message = getRegisterApiErrorMessage(errorData);

        if (status === 409) {
          if (errorData.detail === 'email already registered') {
            setEmailError('Este e-mail já está cadastrado.');
            setStep(2);
            return;
          } else if (errorData.detail === 'phone already registered') {
            setTelefoneError('Este telefone já está cadastrado.');
            setStep(1);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
      {step <= 3 ? (
        <View style={styles.progressWrap}>
          <AppStepProgress
            currentStep={step}
            totalSteps={3}
            segmentHeight={height * 0.008}
            gap={0}
            trackColor="#DCDCDC"
            fillFractions={
              step === 1 ? [0.5, 0, 0] : step === 2 ? [1, 0.5, 0] : [1, 1, 0.5]
            }
          />
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.content}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: height * 0.05 }}>
            <AppTitle size={titleSize} marginBottom={0} style={styles.title}>
              Seus dados
            </AppTitle>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={{ color: '#730d83', fontSize: labelSize + 2, fontWeight: 'bold' }}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Primeiro Nome"
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              labelSize={labelSize}
              inputSize={inputSize}
              minHeight={inputHeight}
              radius={inputRadius}
            />
            <AppInput
              label="Sobrenome"
              placeholder="Sobrenome"
              value={sobrenome}
              onChangeText={setSobrenome}
              autoCapitalize="words"
              labelSize={labelSize}
              inputSize={inputSize}
              minHeight={inputHeight}
              radius={inputRadius}
            />
            <AppInput
              label="Telefone"
              placeholder="(00) 0 0000-0000"
              value={telefone}
              onChangeText={(value) => {
                setTelefone(formatPhone(value));
                if (telefoneError) setTelefoneError('');
              }}
              keyboardType="phone-pad"
              labelSize={labelSize}
              inputSize={inputSize}
              minHeight={inputHeight}
              radius={inputRadius}
              errorMessage={telefoneError}
            />
          </View>

          <View style={styles.buttonArea}>
            <AppButton
              label="Proximo"
              onPress={nextFromStep1}
              disabled={!isStep1Valid}
              radius={buttonRadius}
              labelStyle={{ fontSize: buttonLabelSize, color: isStep1Valid ? enabledButtonLabelColor : disabledButtonLabelColor }}
              containerStyle={[
                styles.primaryButton,
                !isStep1Valid ? styles.buttonDisabled : undefined,
              ]}
            />
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.content}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: height * 0.015 }}>
            <AppTitle size={titleSize} marginBottom={0} style={styles.title}>
              Criar cadastro
            </AppTitle>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={{ color: '#730d83', fontSize: labelSize + 2, fontWeight: 'bold' }}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Email"
              placeholder="exemplo@email.com"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              errorMessage={emailError}
              labelSize={labelSize}
              inputSize={inputSize}
              minHeight={inputHeight}
              radius={inputRadius}
            />
            <AppInput
              label="Senha"
              placeholder="Criar senha"
              value={password}
              onChangeText={setPassword}
              secureToggle
              errorMessage={passwordError}
              labelSize={labelSize}
              inputSize={inputSize}
              minHeight={inputHeight}
              radius={inputRadius}
            />
            <AppInput
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureToggle
              errorMessage={confirmPasswordError}
              labelSize={labelSize}
              inputSize={inputSize}
              minHeight={inputHeight}
              radius={inputRadius}
            />

            <View style={styles.legalRow}>
              <AppCheckbox checked={acceptedTerms} onToggle={() => setAcceptedTerms((state) => !state)} label="" />
              <AppLegalConsent
                onTermsPress={() => Linking.openURL('https://sites.google.com/view/imogoapp/termos')}
                onPrivacyPress={() => Linking.openURL('https://sites.google.com/view/imogoapp/privacy-policy')}
              />
            </View>
          </View>

          <View style={styles.buttonArea}>
            <AppButton
              label="Cadastrar"
              onPress={nextFromStep2}
              disabled={!isStep2Valid}
              radius={buttonRadius}
              labelStyle={{ fontSize: buttonLabelSize, color: isStep2Valid ? enabledButtonLabelColor : disabledButtonLabelColor }}
              containerStyle={[styles.primaryButton, !isStep2Valid ? styles.buttonDisabled : undefined]}
            />
          </View>
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.content}>
          <Text style={styles.helperText}>So mais uma coisa</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: height * 0.01 }}>
            <AppTitle size={titleSize} marginBottom={0} style={styles.title}>
              Como conheceu a imoGo?
            </AppTitle>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={{ color: '#730d83', fontSize: labelSize + 2, fontWeight: 'bold' }}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Nos conte como chegou ate aqui</Text>

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

          <View style={styles.buttonArea}>
            <AppButton
              label={loading ? 'Criando conta...' : 'Concluir'}
              onPress={finishRegister}
              disabled={loading || !isStep3Valid}
              radius={buttonRadius}
              labelStyle={{ fontSize: buttonLabelSize, color: loading || isStep3Valid ? enabledButtonLabelColor : disabledButtonLabelColor }}
              containerStyle={[styles.primaryButton, loading || !isStep3Valid ? styles.buttonDisabled : undefined]}
            />
          </View>
        </View>
      ) : null}

      {step === 4 ? (
        <View style={styles.successWrap}>
          <Image source={require('@/assets/img/success.png')} style={styles.successImage} contentFit="contain" />
          <Text style={styles.successText}>Seu cadastro foi concluido com sucesso!</Text>
          <AppButton
            label="Ir para a tela de login"
            onPress={() => router.push('/login')}
            radius={buttonRadius}
            labelStyle={{ fontSize: buttonLabelSize, color: enabledButtonLabelColor }}
            containerStyle={styles.primaryButton}
          />
        </View>
      ) : null}
      </View>
    </SafeAreaView>
  );
}

