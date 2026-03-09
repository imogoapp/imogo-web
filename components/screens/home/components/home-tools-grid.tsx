import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Alert, Pressable, Text, View, type ImageSourcePropType } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { createHomeToolsGridStyles } from '@/components/screens/home/styles/home-tools-grid-styles';

export type HomeToolItem = {
  id: string;
  icon: ImageSourcePropType;
  label: string;
  disabled?: boolean;
  onPress?: () => void;
};

type HomeToolsGridProps = {
  items: HomeToolItem[];
};

export function HomeToolsGrid({ items }: HomeToolsGridProps) {
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createHomeToolsGridStyles({ width }), [width]);

  return (
    <View style={styles.gridContainer}>
      {items.map((item) => {
        const disabled = !!item.disabled;

        return (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.gridItem,
              disabled ? styles.disabledItem : undefined,
              !disabled && pressed ? styles.pressedItem : undefined,
            ]}
            onPress={
              disabled
                ? undefined
                : () => {
                    if (item.onPress) {
                      item.onPress();
                      return;
                    }

                    Alert.alert('Em breve', `${item.label} sera liberado em breve.`);
                  }
            }>
            <Image source={item.icon} style={styles.icon} contentFit="contain" />
            <Text style={[styles.label, disabled ? styles.disabledLabel : undefined]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
