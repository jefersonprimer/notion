import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { useThemeColor } from '@/hooks/use-theme-color';

interface EllipsisIconProps {
  color?: string;
}

export function EllipsisIcon({ color: colorProp }: EllipsisIconProps) {
  const themeColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const color = colorProp || themeColor;

  return (
    <Svg viewBox="0 0 20 20" width={22} height={22} fill={color}>
      <Path d="M4 11.375a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75m6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75m6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75" />
    </Svg>
  );
}