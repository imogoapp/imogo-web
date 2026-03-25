import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Modal, Pressable, Text, View } from 'react-native';

import { APP_VERSION } from '@/constants/app-version';
import styles from '@/components/screens/home/styles/home-side-menu-styles';

type HomeSideMenuProps = {
  visible: boolean;
  userName: string;
  userEmail: string;
  userPhoto: string;
  onClose: () => void;
  onLogout: () => void;
};

export function HomeSideMenu({ visible, userName, userEmail, userPhoto, onClose, onLogout }: HomeSideMenuProps) {
  const navigate = (path: string) => {
    onClose();
    router.push(path as any);
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => undefined}>

          {/* ── Close ──────────────────────── */}
          <View style={styles.closeRow}>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color="#1F2024" />
            </Pressable>
          </View>

          {/* ── User profile ──────────────── */}
          <View style={styles.userBlock}>
            <Image
              source={{ uri: userPhoto || 'https://juca.eu.org/img/icon_dafault.jpg' }}
              style={styles.avatar}
              contentFit="cover"
            />
            <Text style={styles.userName} numberOfLines={1}>{userName || 'Usuário'}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{userEmail || 'Email indisponível'}</Text>
          </View>

          {/* ── Menu items ────────────────── */}
          <View style={styles.menuList}>
            <Pressable style={styles.menuItem} onPress={() => navigate('/home')}>
              <View style={styles.menuIconWrap}>
                <Ionicons name="home-outline" size={20} color="#730d83" />
              </View>
              <Text style={styles.menuItemText}>Home</Text>
              <Ionicons name="chevron-forward" size={18} color="#C4C4C4" style={styles.menuChevron} />
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => navigate('/conta')}>
              <View style={styles.menuIconWrap}>
                <Ionicons name="person-outline" size={20} color="#730d83" />
              </View>
              <Text style={styles.menuItemText}>Minha Conta</Text>
              <Ionicons name="chevron-forward" size={18} color="#C4C4C4" style={styles.menuChevron} />
            </Pressable>
          </View>

          {/* ── Logout ────────────────────── */}
          <Pressable style={styles.logoutRow} onPress={onLogout}>
            <View style={styles.logoutIconWrap}>
              <Ionicons name="log-out-outline" size={20} color="#D9534F" />
            </View>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>

          {/* ── Version footer ────────────── */}
          <View style={styles.versionFooter}>
            <Text style={styles.versionText}>imoGo v{APP_VERSION}</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
