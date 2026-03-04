import { Text, StyleSheet, type TextStyle } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AppLegalConsentProps = {
  style?: TextStyle;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
};

export function AppLegalConsent({ style, onTermsPress, onPrivacyPress }: AppLegalConsentProps) {
  return (
    <Text style={[styles.base, style]}>
      Eu li e estou de acordo com os{' '}
      <Text style={styles.link} onPress={onTermsPress}>
        Termos e Condicoes
      </Text>{' '}
      e com a{' '}
      <Text style={styles.link} onPress={onPrivacyPress}>
        Politica de Privacidade
      </Text>
      .
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: AppTheme.colors.text,
    fontSize: AppTheme.typography.bodySm,
    lineHeight: 22,
    fontFamily: AppTheme.typography.fontRegular,
    flex: 1,
  },
  link: {
    color: AppTheme.colors.primary,
    fontFamily: AppTheme.typography.fontBold,
  },
});
