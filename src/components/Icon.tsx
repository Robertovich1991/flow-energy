import React from 'react';
import Svg, { Path } from 'react-native-svg';

type IconName =
  | 'arrow-right'
  | 'play'
  | 'shopping-bag'
  | 'clock'
  | 'headphones'
  | 'sparkle'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'user'
  | 'coin';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

export const Icon: React.FC<Props> = ({ name, size = 18, color = '#FFFFFF' }) => {
  switch (name) {
    case 'arrow-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12h14M13 5l7 7-7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'play':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 5v14l11-7-11-7z" fill={color} />
        </Svg>
      );
    case 'shopping-bag':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 7h12l-1 12H7L6 7z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M9 7a3 3 0 116 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke={color} strokeWidth={2} />
          <Path d="M12 7v5l3 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'headphones':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 13a8 8 0 1116 0" stroke={color} strokeWidth={2} />
          <Path d="M6 13h2v6H6a2 2 0 01-2-2v-2a2 2 0 012-2zm10 0h2a2 2 0 012 2v2a2 2 0 01-2 2h-2v-6z" fill={color} />
        </Svg>
      );
    case 'sparkle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill={color} />
        </Svg>
      );
    case 'mail':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 11H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M7 11V7a5 5 0 0110 0v4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'eye':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth={2} />
          <Path d="M12 9a3 3 0 100 6 3 3 0 000-6z" stroke={color} strokeWidth={2} />
        </Svg>
      );
    case 'eye-off':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M1 1l22 22" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'user':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M12 11a4 4 0 100-8 4 4 0 000 8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'coin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    default:
      return null;
  }
};

export default Icon;


