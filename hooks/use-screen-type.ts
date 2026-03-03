import { useWindowDimensions } from 'react-native';

import { Breakpoints } from '@/constants/theme';

export function useScreenType() {
  const { width, height } = useWindowDimensions();
  const isMobile = width < Breakpoints.mobileMaxWidth;

  return {
    width,
    height,
    isMobile,
    screenType: isMobile ? 'mobile' : 'desktop',
  } as const;
}
