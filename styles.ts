import { Colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const fontFamilies = {
  regular: 'Manrope-Regular',
  medium: 'Manrope-Medium',
  semiBold: 'Manrope-SemiBold',
  bold: 'Manrope-Bold',
  extraBold: 'Manrope-ExtraBold',
} as const;

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
  },
});

export const GRADIENT_DARK = [Colors.neutral[100], Colors.neutral[95]] as const;
export const GRADIENT_CARD = [Colors.neutral[90], Colors.neutral[95]] as const;
