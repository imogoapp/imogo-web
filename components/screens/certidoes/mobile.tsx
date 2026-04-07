import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, Text, View, Modal, TouchableOpacity } from "react-native";

import { CertidoesContent } from "./content";
import { createCertidoesPreviewMobileStyles } from "./styles/preview-mobile-styles";
import { useState } from "react";

export default function CertidoesMobile() {
  
  const styles = createCertidoesPreviewMobileStyles();

  const [modalVisible, setModalVisible] = useState(false); // Controla o primeiro modal (categoria)
  const closeMenu = () => setModalVisible(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.push("/")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#730d83" />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          {CertidoesContent.title}
        </Text>
      </View>

      <Text allowFontScaling={false} style={styles.classificacaoText}>
        {" "}
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.row}>
            <Text allowFontScaling={false} style={styles.checkboxLabel}>
              {CertidoesContent.previewText}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.optionButtonsContainer}>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.optionButton}
              >
                <Image
                  source={require("@/assets/icons/plus.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text allowFontScaling={false} style={styles.optionTextTitle}>
                    {CertidoesContent.previewActionLabel}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => router.push("/certidoes/minhas-emissoes")}
                style={styles.optionButton}
              >
                <Image
                  source={require("@/assets/icons/files.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text allowFontScaling={false} style={styles.optionTextTitle}>
                    {CertidoesContent.previewActionLabelTwo}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => router.replace("/home")}
              style={styles.laterButton}
            >
              <Image
                source={require("@/assets/icons/home.png")}
                style={styles.laterIcon}
                contentFit="contain"
              />
              <Text allowFontScaling={false} style={styles.laterButtonText}>
                Voltar pra home
              </Text>
            </Pressable>
          </View>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.modalTitle} allowFontScaling={false}>
                  Tipo de emissão:{" "}
                </Text>
                <View style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={styles.categoryButton}
                    onPress={() => {closeMenu(); router.push("/certidoes/proprietario/cpf")}}
                  >
                    <Image
                      source={require("@/assets/icons/2perfil.png")}
                      style={styles.categoryIcon}
                    />
                    <Text style={styles.categoryText} allowFontScaling={false}>
                      CPF
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryButton}
                    onPress={() => {closeMenu(); router.push("/certidoes/proprietario/cnpj")}}
                  >
                    <Image
                      source={require("@/assets/icons/cnpj.png")}
                      style={styles.categoryIcon}
                    />
                    <Text style={styles.categoryText} allowFontScaling={false}>
                      CNPJ
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
