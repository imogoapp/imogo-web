import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Linking, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

import { PlanejadorContent} from "./content";
import { createPlanejadorPreviewMobileStyles } from "./styles/preview-mobile-styles";

export default function PlanejadorMobile() {
  const styles = createPlanejadorPreviewMobileStyles();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => router.push("/")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#730d83" />
        </Pressable>
        <Text allowFontScaling={false} style={styles.headerTitle}>
          {PlanejadorContent.title}
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
              {PlanejadorContent.previewText}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.optionButtonsContainer}>
              <Pressable
                onPress={() => {Linking.openURL('https://cdn.imogo.com.br/manuais/dando_os_primeiros_passos.pdf');}}
                style={styles.optionButton}
              >
                <Image
                  source={require("@/assets/icons/download.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text allowFontScaling={false} style={styles.optionTextTitle}>
                    {PlanejadorContent.b1}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {Linking.openURL('https://juk.re/cronograma-postagem');}}
                style={styles.optionButton}
              >
                <Image
                  source={require("@/assets/icons/download.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text allowFontScaling={false} style={styles.optionTextTitle}>
                    {PlanejadorContent.b2}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {Linking.openURL('https://www.canva.com/design/DAGdnOpmQEM/LIuZfAtKG-HtZ_u2ean2LA/view');}}
                style={styles.optionButton}
              >
                <Image
                  source={require("@/assets/icons/download.png")}
                  style={styles.optionIcon}
                  contentFit="contain"
                />
                <View style={styles.optionTextContainer}>
                  <Text allowFontScaling={false} style={styles.optionTextTitle}>
                    {PlanejadorContent.b3}
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
