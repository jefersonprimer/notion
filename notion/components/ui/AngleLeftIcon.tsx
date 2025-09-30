import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface AngleLeftIconProps {
  color?: string;
}

export function AngleLeftIcon({ color }: AngleLeftIconProps) {
  return (
    <Svg width={24} height={24} fill={color} xmlns="http://www.w3.org/2000/Svg" viewBox="0 0 24 24" data-t="angle-left-Svg" aria-hidden="true" role="img" style={{ transform: [{ rotate: '180deg' }] }}>
      <Path d="M8.6 7.4L10 6l6 6-6 6-1.4-1.4 4.6-4.6z">
      </Path>
    </Svg>
  );
}
