import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, Text, View , Linking} from "react-native";

import { HomeStagingContent} from "./content";
import { createHomeStagingPreviewMobileStyles } from "./styles/preview-mobile-styles";

export default function HomeStagingMobile() {
  const styles = createHomeStagingPreviewMobileStyles();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.push("/")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#730d83" />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          {HomeStagingContent.title}
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
              {HomeStagingContent.previewText}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.optionButtonsContainer}>
              <Pressable
                style={styles.optionButton}
                onPress={() => {Linking.openURL('https://juk.re/manual-celer');}}
              >
                <Image
                  source={require("@/assets/icons/info.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {HomeStagingContent.manual}
                  </Text>
                </View>
              </Pressable>
              {/*  */}
              <Pressable
                style={styles.optionButton}
                onPress={() => {Linking.openURL('https://juk.re/ia-home');}}
              >
                <Image
                  source={require("@/assets/icons/foto_ia.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {HomeStagingContent.ia}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.optionButton}
                onPress={() => {Linking.openURL('https://juk.re/celer-botao');}}
              >
                <Image
                  source={require("@/assets/icons/whatsapp.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text
                    style={styles.optionTextTitle}
                    allowFontScaling={false}
                  >
                    {HomeStagingContent.wa}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
