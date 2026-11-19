import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { AppTheme } from '@/constants/app-theme';

const TERMS_URL = 'https://imogo.com.br/termos-de-uso';
const PRIVACY_URL = 'https://imogo.com.br/politica-de-privacidade';

type AuthDesktopShellProps = {
  children: ReactNode;
  bannerTitle?: string;
  bannerSubtitle?: string;
  maxFormWidth?: number;
};

const HIGHLIGHTS = [
  'Simulação de crédito nos principais bancos',
  'Precificação inteligente e análise de imóveis',
  'Emissão e gestão de certidões em um só lugar',
];

export function AuthDesktopShell({
  children,
  bannerTitle = 'Sua jornada imobiliária mais simples e segura.',
  bannerSubtitle = 'Acesse ferramentas exclusivas para simular crédito, precificar imóveis e acompanhar cada etapa da negociação.',
  maxFormWidth = 460,
}: AuthDesktopShellProps) {
  const { width } = useWindowDimensions();
  const showBanner = width >= 900;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.formPane}
        contentContainerStyle={styles.formPaneContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.formContainer, { maxWidth: maxFormWidth }]}>
          {children}

          <View style={styles.legalFooter}>
            <Pressable onPress={() => void Linking.openURL(TERMS_URL)} hitSlop={6}>
              <Text style={styles.legalLink}>Termos de Uso</Text>
            </Pressable>
            <Text style={styles.legalDot}>·</Text>
            <Pressable onPress={() => void Linking.openURL(PRIVACY_URL)} hitSlop={6}>
              <Text style={styles.legalLink}>Política de Privacidade</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {showBanner ? (
        <View style={styles.bannerPane}>
          <Image
            source={require('@/assets/img/bg.png')}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerContent}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>imoGo Plataforma Imobiliária</Text>
              </View>
              <Text style={styles.bannerTitle}>{bannerTitle}</Text>
              <Text style={styles.bannerSubtitle}>{bannerSubtitle}</Text>

              <View style={styles.highlightsList}>
                {HIGHLIGHTS.map((item) => (
                  <View key={item} style={styles.highlightRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.highlightText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: AppTheme.colors.background,
    minHeight: '100%',
  },
  formPane: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  formPaneContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 40,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  legalFooter: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  legalLink: {
    fontSize: 12,
    color: AppTheme.colors.muted,
    fontFamily: AppTheme.typography.fontRegular,
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontSize: 12,
    color: AppTheme.colors.muted,
  },
  bannerPane: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 14, 24, 0.42)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 40,
  },
  bannerContent: {
    width: '100%',
    maxWidth: 460,
    gap: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: AppTheme.typography.fontBold,
    letterSpacing: 0.4,
  },
  bannerTitle: {
    fontSize: 32,
    lineHeight: 40,
    color: '#FFFFFF',
    fontFamily: AppTheme.typography.fontBold,
  },
  bannerSubtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: AppTheme.typography.fontRegular,
  },
  highlightsList: {
    marginTop: 8,
    gap: 12,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
    fontFamily: AppTheme.typography.fontBold,
  },
});
