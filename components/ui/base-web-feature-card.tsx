import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

import { BaseWebButton } from './base-web-button';

type BaseWebFeatureCardProps = {
  title: string;
  description: string;
  icon: ImageSourcePropType;
  accentColor: string;
  disabled?: boolean;
  onPress?: () => void;
};

export function BaseWebFeatureCard({ title, description, icon, accentColor, disabled = false, onPress }: BaseWebFeatureCardProps) {
  return (
    <View style={[styles.card, disabled ? styles.cardDisabled : undefined]}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Image source={icon} style={styles.icon} contentFit="contain" />
        </View>
        <View style={[styles.statusPill, disabled ? styles.statusPillDisabled : { backgroundColor: `${accentColor}18` }]}>
          <Ionicons name={disabled ? 'lock-closed-outline' : 'checkmark-circle-outline'} size={14} color={disabled ? '#8F8A95' : accentColor} />
          <Text style={[styles.statusText, disabled ? styles.statusTextDisabled : { color: accentColor }]}>
            {disabled ? 'Desativado' : ''}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <BaseWebButton
        label={disabled ? 'Em breve' : 'Acessar'}
        leftIconName={disabled ? 'time-outline' : 'arrow-forward-outline'}
        variant={disabled ? 'disabled' : 'primary'}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E6DFEA',
    gap: 16,
    shadowColor: '#15081D',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardDisabled: {
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 28,
    height: 28,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusPillDisabled: {
    backgroundColor: '#e3e3e3',
  },
  statusText: {
    fontSize: 12,
    fontFamily: AppTheme.typography.fontBold,
  },
  statusTextDisabled: {
    color: '#8F8A95',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5F6170',
    fontFamily: AppTheme.typography.fontRegular,
    minHeight: 66,
  },
});
