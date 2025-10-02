import React from 'react';
import Svg, { Path, G, Rect, Circle } from 'react-native-svg';
import { theme } from '../theme';

interface TabIconProps {
  focused: boolean;
  size?: number;
}

export const HomeIcon: React.FC<TabIconProps> = ({ focused, size = 20 }) => {
  const color = focused ? theme.colors.primary : '#9AA0A6';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G stroke={color} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        <Path d="M3 9.8 10 4l7 5.8" />
        <Path d="M5.2 9.8V16h9.6V9.8" />
        <Rect x="8.4" y="12" width="3.2" height="4" rx="0.8" />
      </G>
    </Svg>
  );
};

export const CardsIcon: React.FC<TabIconProps> = ({ focused, size = 20 }) => {
  const color = focused ? theme.colors.primary : '#9AA0A6';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G stroke={color} strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
        {/* left tilted card */}
        <Rect x="2.5" y="6.5" width="10" height="14" rx="1.8" transform="rotate(-12 2.5 6.5)"/>
        {/* right tilted card */}
        <Rect x="8.5" y="5" width="10" height="14" rx="1.8" transform="rotate(12 8.5 5)"/>
        {/* front card */}
        <Rect x="4.5" y="3.5" width="11" height="15" rx="2"/>
        {/* tree mark on front card */}
        <Path d="M10 12.6v2.8M10 12.6c-.8-.3-1.4-1-1.4-1.9 0-1.1.9-2 2-2s2 .9 2 2c0 .9-.6 1.6-1.4 1.9M10 12.6l-1.2-1.4M10 12.6l1.2-1.4" />
      </G>
    </Svg>
  );
};

export const StreamsIcon: React.FC<TabIconProps> = ({ focused, size = 20 }) => {
  const color = focused ? theme.colors.primary : '#9AA0A6';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G stroke={color} strokeWidth="1.1" strokeLinecap="round">
        <Path d="M3 5.5h14" />
        <Path d="M4.2 7.2H15.5" />
        <Path d="M5.4 8.8H14.2" />
        <Path d="M6.6 10.2H13" />
        <Path d="M7.8 11.4h4.8" />
        <Path d="M9 12.6h3.2" />
        <Path d="M9.8 13.8h2" />
        <Path d="M10.4 15h1.2" />
        <Path d="M11 16.2h.6" />
        {/* funnel outline */}
        <Path d="M3 5.5c4.6 2.6 9.4 2.6 14 0M17 5.5c-1.5 4.6-4.8 7.8-7 10.6-2.2-2.8-5.5-6-7-10.6" />
      </G>
    </Svg>
  );
};

export const ProfileIcon: React.FC<TabIconProps> = ({ focused, size = 20 }) => {
  const color = focused ? theme.colors.primary : '#9AA0A6';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <G stroke={color} strokeWidth="1.2">
        <Circle cx="10" cy="6.5" r="3.2"/>
        <Path d="M4.2 16.5c0-3.4 3-5.2 5.8-5.2s5.8 1.8 5.8 5.2" />
        <Rect x="4.2" y="11.3" width="11.6" height="5.2" rx="2.2" />
      </G>
    </Svg>
  );
};


