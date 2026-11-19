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

export function BaseWebFeatureCard({
  title,
  description,
  icon,
  accentColor,
  disabled = false,
  onPress,
}: BaseWebFeatureCardProps) {
  return (
    <View style={[styles.card, disabled ? styles.cardDisabled : undefined]}>
      <View style={styles.topContent}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Image source={icon} style={styles.icon} contentFit="contain" />
          </View>
          {disabled ? (
            <View style={[styles.statusPill, styles.statusPillDisabled]}>
              <Ionicons name="lock-closed-outline" size={13} color="#8F8A95" />
              <Text style={[styles.statusText, styles.statusTextDisabled]}>
                Desativado
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

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
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6DFEA',
    gap: 14,
    shadowColor: '#15081D',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardDisabled: {
    backgroundColor: '#f5f5f5',
  },
  topContent: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillFree: {
    backgroundColor: '#D1FAE5',
  },
  statusPillDisabled: {
    backgroundColor: '#e3e3e3',
  },
  statusText: {
    fontSize: 11,
    fontFamily: AppTheme.typography.fontBold,
  },
  statusTextFree: {
    color: '#047857',
  },
  statusTextDisabled: {
    color: '#8F8A95',
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5F6170',
    fontFamily: AppTheme.typography.fontRegular,
    minHeight: 38,
  },
});
