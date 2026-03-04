import { StyleSheet, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AppStepProgressProps = {
  currentStep: number;
  totalSteps: number;
  segmentHeight?: number;
  gap?: number;
  trackColor?: string;
  fillColor?: string;
  fillFractions?: number[];
};

export function AppStepProgress({
  currentStep,
  totalSteps,
  segmentHeight = 7,
  gap = 6,
  trackColor = '#dcdcdc',
  fillColor = AppTheme.colors.primary,
  fillFractions,
}: AppStepProgressProps) {
  return (
    <View style={[styles.container, { gap }]}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const fraction =
          fillFractions && typeof fillFractions[index] === 'number'
            ? Math.max(0, Math.min(1, fillFractions[index] ?? 0))
            : step <= currentStep
              ? 1
              : 0;

        return (
          <View
            key={step}
            style={[
              styles.segment,
              { height: segmentHeight, backgroundColor: trackColor },
            ]}>
            <View style={[styles.segmentFill, { width: `${fraction * 100}%`, backgroundColor: fillColor }]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  segment: {
    flex: 1,
    borderRadius: 999,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
  },
});
