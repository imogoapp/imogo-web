import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

import { BaseWebButton } from './base-web-button';

type BaseWebUserMenuProps = {
  visible: boolean;
  userName: string;
  userEmail: string;
  userPhoto?: string;
  onClose: () => void;
  onLogout: () => void;
};

export function BaseWebUserMenu({ visible, userName, userEmail, userPhoto, onClose, onLogout }: BaseWebUserMenuProps) {
  const handleAccount = () => {
    onClose();
    router.push('/conta');
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.panelWrap} pointerEvents="box-none">
          <View style={styles.panel}>
            <Image
              source={{ uri: userPhoto || 'https://juca.eu.org/img/icon_dafault.jpg' }}
              style={styles.avatar}
              contentFit="cover"
            />
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.email}>{userEmail}</Text>
            <BaseWebButton label="Minha Conta" leftIconName="person-outline" onPress={handleAccount} />
            <BaseWebButton label="Sair" leftIconName="log-out-outline" onPress={onLogout} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 14, 23, 0.18)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  panelWrap: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 88,
    paddingRight: 32,
  },
  panel: {
    width: 300,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E6DFEA',
    shadowColor: '#15081D',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
  },
  name: {
    fontSize: 18,
    color: AppTheme.colors.text,
    fontFamily: AppTheme.typography.fontBold,
  },
  email: {
    fontSize: 14,
    color: '#6A6D78',
    fontFamily: AppTheme.typography.fontRegular,
    marginBottom: 8,
  },
});

