import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import Head from "expo-router/head";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import "react-native-reanimated";

import GlobalPageLoader from "@/components/ui/global-page-loader";
import { useAnalytics } from "@/hooks/use-analytics";
import { useColorScheme } from "@/hooks/use-color-scheme";

WebBrowser.maybeCompleteAuthSession();

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const { trackEvent } = useAnalytics();
  const previousPathnameRef = useRef<string | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(true);
  const [fontsLoaded, fontsError] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsError) {
      throw fontsError;
    }
  }, [fontsError]);

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = "pt-BR";
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Ignore registration error in development.
    });
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const from = previousPathnameRef.current;
    const to = pathname;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const nextUrl = baseUrl ? `${baseUrl}${to}` : undefined;
    const fromUrl = from && baseUrl ? `${baseUrl}${from}` : undefined;
    trackEvent(
      pathname,
      {
        event: "navigation",
        ...(from ? { from } : {}),
        to,
        ...(fromUrl ? { fromUrl } : {}),
        ...(nextUrl ? { toUrl: nextUrl } : {}),
      },
      { url: nextUrl },
    );

    previousPathnameRef.current = pathname;
  }, [pathname, trackEvent]);

  useEffect(() => {
    setIsRouteLoading(true);

    const timeoutId = setTimeout(() => {
      setIsRouteLoading(false);
    }, 250);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  if (!fontsLoaded) {
    return <GlobalPageLoader />;
  }

  return (
    <>
      <Head>
        <meta httpEquiv="content-language" content="pt-BR" />
        <meta name="theme-color" content="#730d83" />
        <meta name="application-name" content="imoGo" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="imoGo" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msapplication-TileColor" content="#730d83" />
        <meta property="og:site_name" content="imoGo" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/img/favicon.png" />
      </Head>

      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, position: "relative" }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
          {isRouteLoading ? <GlobalPageLoader /> : null}
        </View>
      </ThemeProvider>
    </>
  );
}
