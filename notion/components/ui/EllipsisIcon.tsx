import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface EllipsisIconProps {
  color: string;
}

export function EllipsisIcon({color}: EllipsisIconProps) {
  return (
    <svg aria-hidden="true" role="graphics-symbol" viewBox="0 0 20 20" width={22} height={22} fill={color}>
      <path d="M4 11.375a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75m6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75m6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75">
      </path>
    </svg>
  );
}
