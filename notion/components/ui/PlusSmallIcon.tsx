import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { useThemeColor } from '@/hooks/use-theme-color';

interface PlusSmallIconProps {
  color?: string;
}

export function PlusSmallIcon({ color: colorProp }: PlusSmallIconProps) {
  const themeColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const color = colorProp || themeColor;

  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 16 16" width={20} height={20} fill={color}>
      <Path d="M8 2.74a.66.66 0 0 1 .66.66v3.94h3.94a.66.66 0 0 1 0 1.32H8.66v3.94a.66.66 0 0 1-1.32 0V8.66H3.4a.66.66 0 0 1 0-1.32h3.94V3.4A.66.66 0 0 1 8 2.74">
      </Path>
    </Svg>
  );
}
