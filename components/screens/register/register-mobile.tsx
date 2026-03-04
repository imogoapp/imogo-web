import { router } from 'expo-router';
import { Image } from 'expo-image';
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
    origem: string;
    acceptedTerms: boolean;
  }) => void;
};

const options = ['Facebook', 'Instagram', 'Google', 'Loja de aplicativos', 'Indicacao de amigos', 'Outro'] as const;

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
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const confirmPasswordError =
    confirmPassword.length > 0 && password !== confirmPassword ? 'As senhas nao coincidem.' : '';

  const isStep1Valid = useMemo(() => {
    return !!nome.trim() && !!sobrenome.trim() && telefone.replace(/\D/g, '').length === 11;
  }, [nome, sobrenome, telefone]);

  const isStep2Valid = useMemo(() => {
    return (
      !!email.trim() &&
      !!password.trim() &&
      !!confirmPassword.trim() &&
      validateEmail(email) &&
      password === confirmPassword &&
      acceptedTerms
    );
  }, [email, password, confirmPassword, acceptedTerms]);

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

    setEmailError(validateEmail(value) ? '' : 'Por favor, insira um e-mail valido.');
  };

  const nextFromStep1 = () => {
    if (!isStep1Valid) {
      showAlert('Atencao', 'Preencha nome, sobrenome e telefone valido.');
      return;
    }

    setStep(2);
  };

  const nextFromStep2 = () => {
    if (!isStep2Valid) {
      showAlert('Atencao', 'Revise os dados de cadastro e os termos.');
      return;
    }

    setStep(3);
  };

  const finishRegister = () => {
    if (!selectedOption) {
      showAlert('Atencao', 'Selecione uma opcao de origem.');
      return;
    }

    onRegisterPress?.({
      nome,
      sobrenome,
      telefone,
      email,
      password,
      origem: selectedOption,
      acceptedTerms,
    });

    setStep(4);
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
          <AppTitle size={titleSize} marginBottom={height * 0.05} style={styles.title}>
            Seus dados
          </AppTitle>

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
              wrapperBackgroundColor="#F4F4F4"
              wrapperBorderColor="#C4C4C4"
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
              wrapperBackgroundColor="#F4F4F4"
              wrapperBorderColor="#C4C4C4"
            />
            <AppInput
              label="Telefone"
              placeholder="(00) 0 0000-0000"
              value={telefone}
              onChangeText={(value) => setTelefone(formatPhone(value))}
              keyboardType="phone-pad"
              labelSize={labelSize}
              inputSize={inputSize}
              minHeight={inputHeight}
              radius={inputRadius}
              wrapperBackgroundColor="#F4F4F4"
              wrapperBorderColor="#C4C4C4"
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
          <AppTitle size={titleSize} marginBottom={height * 0.015} style={styles.title}>
            Criar cadastro
          </AppTitle>

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
              wrapperBackgroundColor="#F4F4F4"
              wrapperBorderColor="#C4C4C4"
            />
            <AppInput
              label="Senha"
              placeholder="Criar senha"
              value={password}
              onChangeText={setPassword}
              secureToggle
              labelSize={labelSize}
              inputSize={inputSize}
              minHeight={inputHeight}
              radius={inputRadius}
              wrapperBackgroundColor="#F4F4F4"
              wrapperBorderColor="#C4C4C4"
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
              wrapperBackgroundColor="#F4F4F4"
              wrapperBorderColor="#C4C4C4"
            />

            <View style={styles.legalRow}>
              <AppCheckbox checked={acceptedTerms} onToggle={() => setAcceptedTerms((state) => !state)} label="" />
              <AppLegalConsent
                onTermsPress={() => Linking.openURL('https://imogo.com.br/01')}
                onPrivacyPress={() => Linking.openURL('https://imogo.com.br/02')}
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
          <AppTitle size={titleSize} marginBottom={height * 0.01} style={styles.title}>
            Como conheceu a imoGo?
          </AppTitle>
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
              label="Concluir"
              onPress={finishRegister}
              disabled={!isStep3Valid}
              radius={buttonRadius}
              labelStyle={{ fontSize: buttonLabelSize, color: isStep3Valid ? enabledButtonLabelColor : disabledButtonLabelColor }}
              containerStyle={[styles.primaryButton, !isStep3Valid ? styles.buttonDisabled : undefined]}
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
