import { router } from "expo-router";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View, TouchableOpacity } from "react-native";

import { createBaseWebNavigationItems } from "@/components/screens/home/home-tools";
import BaseWeb from "@/components/ui/base-web";
import { AuthUser } from "@/services/auth";
import { Ionicons } from '@expo/vector-icons';

import { CertidoesContent } from "./content";
import styles from "./styles/web-styles";

type CertidoesDesktopProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

export default function CertidoesDesktop({
  user,
  onLogout,
}: CertidoesDesktopProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const closeMenu = () => setModalVisible(false);
  const navigationItems = useMemo(
    () =>
      createBaseWebNavigationItems({
        activeId: "certidoes",
        onNavigate: (path) => router.replace(path as never),
      }),
    [],
  );

  return (
    <BaseWeb user={user} navigationItems={navigationItems} onLogout={onLogout}>
      <ScrollView contentContainerStyle={styles.contentMinimal}>
        <Text style={styles.title}>{CertidoesContent.title}</Text>

        <View style={styles.container}>
          <View style={styles.row}>
            <Text allowFontScaling={false} style={styles.checkboxLabel}>
              {CertidoesContent.previewText}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.optionButtonsContainer}>
              <Pressable
                style={styles.optionButton}
                onPress={() => setModalVisible(true)}
              >
                <Image
                  source={require("@/assets/icons/plus.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {CertidoesContent.previewActionLabel}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.optionButton}
               onPress={() => router.push("/certidoes/minhas-emissoes")}
              >
                <Image
                  source={require("@/assets/icons/files.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {CertidoesContent.previewActionLabelTwo}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.laterButton}
              onPress={() => router.replace("/home")}
            >
              <Image
                source={require("@/assets/icons/home.png")}
                style={styles.laterIcon}
                contentFit="contain"
              />
              <Text style={styles.laterButtonText} allowFontScaling={false}>
                Voltar pra home
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
      >

          <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                      <Ionicons name="close" size={24} color="#FFF" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle} allowFontScaling={false}>Tipo de emissão: </Text>
                  <View style={styles.categoryContainer}>
                      <TouchableOpacity style={styles.categoryButton} onPress={() =>{ closeMenu(); router.push("/certidoes/proprietario/cpf")}}>
                          <Image
                              source={require('@/assets/icons/2perfil.png')}
                              style={styles.categoryIcon}
                          />
                          <Text style={styles.categoryText} allowFontScaling={false}>CPF</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.categoryButton} onPress={() =>{ closeMenu(); router.push("/certidoes/proprietario/cnpj")}}>
                          <Image
                              source={require('@/assets/icons/cnpj.png')}
                              style={styles.categoryIcon}
                          />
                          <Text style={styles.categoryText} allowFontScaling={false}>CNPJ</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
    </BaseWeb>
  );
}
