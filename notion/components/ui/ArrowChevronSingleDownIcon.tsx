import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ArrowChevronSingleDownIconProps {
  color?: string;
}

export function ArrowChevronSingleDownIcon({ color: colorProp }: ArrowChevronSingleDownIconProps) {
  const themeColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const color = colorProp || themeColor;

  return (
    <Svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={22} height={22} fill={color}>
      <Path d="M9.558 13.442c.244.244.64.244.884 0l5.4-5.4a.625.625 0 1 0-.884-.884L10 12.116 5.042 7.158a.625.625 0 0 0-.884.884z">
      </Path>
    </Svg>
  );
}
