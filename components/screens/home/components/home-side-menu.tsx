import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Modal, Pressable, Text, View } from 'react-native';
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
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => undefined}>
          <View style={styles.closeRow}>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#1F2024" />
            </Pressable>
          </View>

          <View style={styles.userBlock}>
            <Image
              source={{ uri: userPhoto || 'https://juca.eu.org/img/icon_dafault.jpg' }}
              style={styles.avatar}
              contentFit="cover"
            />
            <Text style={styles.userName}>{userName || 'Usuario'}</Text>
            <Text style={styles.userEmail}>{userEmail || 'Email indisponivel'}</Text>
          </View>

          <View style={styles.menuList}>
            <View style={styles.menuItem}>
              <Ionicons name="home-outline" size={22} color="#1F2024" />
              <Text style={styles.menuItemText}>Home</Text>
            </View>

            <Pressable style={[styles.menuItem, styles.logoutItem]} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={22} color="#D9534F" />
              <Text style={[styles.menuItemText, styles.logoutText]}>Sair</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
