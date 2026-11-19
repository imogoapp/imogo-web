import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { getHomeFeatureDefinitions } from '@/components/screens/home/home-tools';
import { AppTheme } from '@/constants/app-theme';
import { AuthUser } from '@/services/auth';

const SITE_URL = 'https://imogo.com.br';
const BLOG_URL = `${SITE_URL}/blog`;
const ABOUT_URL = `${SITE_URL}/sobre`;
const PRIVACY_URL = `${SITE_URL}/politica-de-privacidade`;
const TERMS_URL = `${SITE_URL}/termos-de-uso`;
const INSTALL_URL = `${SITE_URL}/instalacao`;
const CONTACT_URL = `${SITE_URL}/contato`;
const STATUS_URL = 'https://status.imogo.com.br';

type BaseWebFooterProps = {
  user?: AuthUser | null;
};

function formatToolLabel(raw: string): string {
  const lower = raw.toLocaleLowerCase('pt-BR');
  return lower.charAt(0).toLocaleUpperCase('pt-BR') + lower.slice(1);
}

const AVAILABLE_TOOLS = getHomeFeatureDefinitions()
  .filter((tool) => !tool.disabled && tool.route)
  .map((tool) => ({
    id: tool.id,
    label: formatToolLabel(tool.label),
    route: tool.route!,
  }));

const RESOURCE_LINKS = [
  { label: 'Blog', url: BLOG_URL },
  { label: 'Sobre', url: ABOUT_URL },
  { label: 'Política de privacidade', url: PRIVACY_URL },
  { label: 'Termos de uso', url: TERMS_URL },
  { label: 'Instalação do Aplicativo', url: INSTALL_URL },
  { label: 'Contato', url: CONTACT_URL },
] as const;

const SOCIAL_LINKS = [
  { icon: 'logo-instagram' as const, url: 'https://instagram.com/imogoapp', label: 'Instagram' },
  { icon: 'logo-facebook' as const, url: 'https://facebook.com/imogoapp', label: 'Facebook' },
  { icon: 'logo-linkedin' as const, url: 'https://linkedin.com/company/imogoapp', label: 'LinkedIn' },
  { icon: 'logo-youtube' as const, url: 'https://youtube.com/@imogoapp', label: 'YouTube' },
];

export function BaseWebFooter(_props: BaseWebFooterProps) {
  const { width } = useWindowDimensions();
  const colWidth = width >= 900 ? '33.3333%' : width >= 600 ? '50%' : '100%';
  const isCompactBottom = width < 760;

  return (
    <View style={styles.footerOuter}>
      <View style={styles.footerInner}>
        <View style={styles.columnsRow}>
          {/* Column 1: Brand */}
          <View style={[styles.column, { width: colWidth }]}>
            <Image
              source={require('@/assets/img/logo.png')}
              style={styles.logo}
              contentFit="contain"
              contentPosition="left"
            />
            <Text style={styles.brandDesc}>
              A plataforma completa para corretores de imóveis. Ferramentas inteligentes para vender mais e melhor.
            </Text>
            <View style={styles.socialRow}>
              {SOCIAL_LINKS.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => void Linking.openURL(item.url)}
                  accessibilityLabel={item.label}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name={item.icon} size={16} color="#5E6272" />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Column 2: Ferramentas */}
          <View style={[styles.column, { width: colWidth }]}>
            <Text style={styles.columnHeading}>FERRAMENTAS</Text>
            <View style={styles.linksList}>
              {AVAILABLE_TOOLS.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(item.route as never)}
                  style={({ pressed }) => [pressed && styles.pressed]}
                >
                  <Text style={styles.linkText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Column 3: Recursos */}
          <View style={[styles.column, { width: colWidth }]}>
            <Text style={styles.columnHeading}>RECURSOS</Text>
            <View style={styles.linksList}>
              {RESOURCE_LINKS.map((item) => (
                <Pressable
                  key={item.url}
                  onPress={() => void Linking.openURL(item.url)}
                  style={({ pressed }) => [pressed && styles.pressed]}
                >
                  <Text style={styles.linkText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={[styles.bottomBar, isCompactBottom && styles.bottomBarCompact]}>
          <View style={styles.bottomLeft}>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={14} color="#74788B" />
              <Text style={styles.bottomMeta}>
                SCN Quadra 05 Bl A, Brasília Shopping — Torre Norte, Asa Norte, Brasília - DF, 70715-900
              </Text>
            </View>
            <View style={styles.legalRow}>
              <Text style={styles.bottomMeta}>CNPJ: 50.509.002/0001-89 · CRECI: 30152</Text>
              <Pressable onPress={() => void Linking.openURL(PRIVACY_URL)}>
                <Text style={styles.bottomLink}>Privacidade</Text>
              </Pressable>
              <Pressable onPress={() => void Linking.openURL(TERMS_URL)}>
                <Text style={styles.bottomLink}>Termos</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.bottomRight, isCompactBottom && styles.bottomRightCompact]}>
            <Pressable
              onPress={() => void Linking.openURL(STATUS_URL)}
              style={styles.statusPill}
            >
              <View style={styles.statusDot} />
              <Text style={styles.statusPillText}>Todos os serviços online</Text>
            </Pressable>
            <View style={styles.copyrightRow}>
              <Text style={styles.bottomMeta}>© {new Date().getFullYear()} imoGo · Desenvolvido por </Text>
              <Pressable onPress={() => void Linking.openURL('https://josuejuca.com')}>
                <Text style={styles.devLink}>Juca</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerOuter: {
    borderTopWidth: 1,
    borderTopColor: '#E8E8EE',
    backgroundColor: '#F5F5F5',
    paddingTop: 40,
    paddingBottom: 28,
    paddingHorizontal: 36,
    marginTop: 24,
  },
  footerInner: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
  },
  columnsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -12,
  },
  column: {
    paddingHorizontal: 12,
    paddingBottom: 28,
    gap: 12,
  },
  logo: {
    width: 72,
    height: 36,
  },
  brandDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6C7080',
    fontFamily: AppTheme.typography.fontRegular,
    maxWidth: 280,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  socialButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnHeading: {
    fontSize: 12,
    letterSpacing: 0.6,
    color: '#484B5B',
    fontFamily: AppTheme.typography.fontBold,
    marginBottom: 2,
  },
  linksList: {
    gap: 9,
  },
  linkText: {
    fontSize: 13,
    color: '#6C7080',
    fontFamily: AppTheme.typography.fontRegular,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8EE',
    marginTop: 8,
    marginBottom: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
  },
  bottomBarCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  bottomLeft: {
    flex: 1,
    gap: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  bottomMeta: {
    fontSize: 12,
    color: '#74788B',
    fontFamily: AppTheme.typography.fontRegular,
  },
  bottomLink: {
    fontSize: 12,
    color: '#74788B',
    fontFamily: AppTheme.typography.fontRegular,
    textDecorationLine: 'underline',
  },
  bottomRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  bottomRightCompact: {
    alignItems: 'flex-start',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#047857',
  },
  statusPillText: {
    fontSize: 12,
    color: '#047857',
    fontFamily: AppTheme.typography.fontBold,
  },
  copyrightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  devLink: {
    fontSize: 12,
    color: AppTheme.colors.primary,
    fontFamily: AppTheme.typography.fontBold,
  },
  pressed: {
    opacity: 0.75,
  },
});
